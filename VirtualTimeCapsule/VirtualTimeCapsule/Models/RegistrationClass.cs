namespace VirtualTimeCapsule.Models
{
    public class RegistrationClass
    {
            public int UserId { get; set; }
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
            public string? Email { get; set; }
            public string? Password { get; set; }
            public int Role { get; set; } = 0;
            public string? Otp { get; set; }
    }
}
