using System.Net;
using System.Net.Mail;

namespace VirtualTimeCapsule.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            string smtpServer = emailSettings["SmtpServer"];
            int smtpPort = int.Parse(emailSettings["SmtpPort"]);
            string senderEmail = emailSettings["SenderEmail"];
            string senderPassword = emailSettings["SenderPassword"];

            using (var client = new SmtpClient(smtpServer, smtpPort))
            {
                client.Credentials = new NetworkCredential(senderEmail, senderPassword);
                client.EnableSsl = true;
                client.Timeout = 15000; // 15 second timeout to prevent hanging the whole service

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, "Virtual Time Capsule"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);
            }
        }
    }
}
