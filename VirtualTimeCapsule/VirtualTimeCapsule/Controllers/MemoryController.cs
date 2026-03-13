using Microsoft.AspNetCore.Mvc;
using VirtualTimeCapsule.BusinessLayer;
using VirtualTimeCapsule.Models;

namespace VirtualTimeCapsule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemoryController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<MemoryController> _logger;

        public MemoryController(IWebHostEnvironment env, ILogger<MemoryController> logger)
        {
            _env = env;
            _logger = logger;
        }

        [HttpPost("add")]
        public IActionResult AddMemory([FromForm] MemoryUploadRequest request)
        {
            string? filePath = null;
            string? fileType = null;

            try
            {
                if (request.CapsuleId <= 0)
                    return BadRequest("Invalid CapsuleId");

                if (request.File != null && request.File.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "memories");

                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    string uniqueFileName = Guid.NewGuid().ToString() +
                                            Path.GetExtension(request.File.FileName);

                    string fullPath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        request.File.CopyTo(stream);
                    }

                    filePath = Path.Combine("uploads/memories", uniqueFileName)
                                .Replace("\\", "/");

                    string extension = Path.GetExtension(request.File.FileName).ToLower();

                    if (extension == ".jpg" || extension == ".jpeg" ||
                        extension == ".png" || extension == ".gif")
                        fileType = "image";

                    else if (extension == ".mp4" || extension == ".webm" ||
                             extension == ".mov")
                        fileType = "video";

                    else if (extension == ".pdf")
                        fileType = "pdf";

                    else
                        fileType = "file";
                }
                else
                {
                    fileType = "text";
                }

                MemoryClass memory = new MemoryClass
                {
                    CapsuleId = request.CapsuleId,
                    Message = request.Message,
                    FilePath = filePath,
                    FileType = fileType
                };

                BLMemory bl = new BLMemory();
                bool result = bl.AddMemory(memory);

                if (result)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Memory saved successfully"
                    });
                }

                return BadRequest(new
                {
                    success = false,
                    message = "Failed to save memory"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Memory upload failed for CapsuleId: {CapsuleId}", request.CapsuleId);
                return StatusCode(500, ex.Message);
            }
        }
    }
}