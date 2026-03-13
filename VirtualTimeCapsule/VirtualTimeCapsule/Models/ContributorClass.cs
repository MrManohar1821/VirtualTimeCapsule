namespace VirtualTimeCapsule.Models
{
    public class ContributorClass
    {
        public int CapsuleId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public DateTime UnlockDate { get; set; }

        public TimeSpan UnlockTime { get; set; }

        public string Note { get; set; }
    }
}
