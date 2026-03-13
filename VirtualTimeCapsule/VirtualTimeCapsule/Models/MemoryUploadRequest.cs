using Microsoft.AspNetCore.Http;

namespace VirtualTimeCapsule.Models
{
    public class MemoryUploadRequest
    {
        public int CapsuleId { get; set; }

        public string? Message { get; set; }

        public IFormFile? File { get; set; }
    }
}