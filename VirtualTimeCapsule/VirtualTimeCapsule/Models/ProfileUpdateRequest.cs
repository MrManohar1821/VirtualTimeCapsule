using Microsoft.AspNetCore.Http;

namespace VirtualTimeCapsule.Models
{
    public class ProfileUpdateRequest
    {
        public int UserId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string? Phone { get; set; }

        public IFormFile? Image { get; set; }
    }
}