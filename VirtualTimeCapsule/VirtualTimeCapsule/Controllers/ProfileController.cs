using Microsoft.AspNetCore.Mvc;
using VirtualTimeCapsule.BusinessLayer;
using VirtualTimeCapsule.Models;

namespace VirtualTimeCapsule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public ProfileController(IWebHostEnvironment env)
        {
            _env = env;
        }

        // =====================================
        // GET PROFILE BY USER ID
        // =====================================
        [HttpGet("user/{userId}")]
        public IActionResult GetProfile(int userId)
        {
            if (userId <= 0)
                return BadRequest("Invalid user id");

            BLProfile bl = new BLProfile();
            var profile = bl.GetProfile(userId);

            if (profile == null)
                return NotFound("Profile not found");

            return Ok(profile);
        }

        // =====================================
        // UPDATE PROFILE
        // =====================================
        [HttpPut("update")]
        [Consumes("multipart/form-data")]
        public IActionResult UpdateProfile([FromForm] ProfileUpdateRequest request)
        {
            try
            {
                if (request.UserId <= 0)
                    return BadRequest("Invalid user id");

                BLProfile bl = new BLProfile();

                var existingProfile = bl.GetProfile(request.UserId);

                if (existingProfile == null)
                    return NotFound("Profile not found");

                string? imagePath = null;

                // =============================
                // HANDLE IMAGE UPLOAD
                // =============================

                if (request.Image != null && request.Image.Length > 0)
                {
                    var allowedTypes = new[] { "image/jpeg", "image/png" };

                    if (!allowedTypes.Contains(request.Image.ContentType))
                        return BadRequest("Only JPG and PNG images are allowed");

                    if (request.Image.Length > 2 * 1024 * 1024)
                        return BadRequest("Image must be less than 2MB");

                    string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "profile");

                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    // Delete old image
                    if (!string.IsNullOrEmpty(existingProfile.ProfileImage))
                    {
                        string oldImagePath = Path.Combine(_env.WebRootPath, existingProfile.ProfileImage);

                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(request.Image.FileName);

                    string filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        request.Image.CopyTo(stream);
                    }

                    imagePath = "uploads/profile/" + fileName;
                }

                // =============================
                // MAP DTO TO MODEL
                // =============================

                ProfileClass model = new ProfileClass
                {
                    UserId = request.UserId,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    Phone = request.Phone,
                    ProfileImage = imagePath
                };

                bool result = bl.UpdateProfile(model);

                if (!result)
                    return BadRequest("Update failed");

                return Ok(new
                {
                    message = "Profile updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Server error: " + ex.Message);
            }
        }
    }
}