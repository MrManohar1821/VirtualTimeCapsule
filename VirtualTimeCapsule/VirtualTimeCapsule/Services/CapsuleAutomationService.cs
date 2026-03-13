using System.Text;
using VirtualTimeCapsule.BusinessLayer;
using VirtualTimeCapsule.Models;

namespace VirtualTimeCapsule.Services
{
    public class CapsuleAutomationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<CapsuleAutomationService> _logger;
        private readonly IConfiguration _configuration;

        // Diagnostic static members to see state from the TestController
        public static string LastStatus { get; private set; } = "Initializing";
        public static List<string> AutomationLogs { get; } = new List<string>();
        public static DateTime LastRunTime { get; private set; }

        private static void AddLog(string msg)
        {
            var logEntry = $"[{DateTime.Now:HH:mm:ss}] {msg}";
            AutomationLogs.Insert(0, logEntry);
            if (AutomationLogs.Count > 20) AutomationLogs.RemoveAt(20);
        }

        public CapsuleAutomationService(IServiceProvider serviceProvider, ILogger<CapsuleAutomationService> logger, IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _configuration = configuration;
            AddLog("Service Instantiated.");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Capsule Automation Service is starting.");
            LastStatus = "Service Started";
            AddLog("ExecuteAsync started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                LastRunTime = DateTime.Now;
                try
                {
                    await ProcessUnlockedCapsules();
                    LastStatus = "Running (Last check successful)";
                }
                catch (Exception ex)
                {
                    LastStatus = $"Error: {ex.Message}";
                    _logger.LogError(ex, "Error occurred while processing unlocked capsules.");
                    AddLog($"FATAL ERROR: {ex.Message}");
                }

                // Wait for 10 seconds for very fast testing
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }

        private async Task ProcessUnlockedCapsules()
        {
            BLCapsule blCapsule = new BLCapsule();
            BLMemory blMemory = new BLMemory();

            DateTime now = DateTime.Now;
            var pendingCapsules = blCapsule.GetUnlockedPendingCapsules(now);

            if (pendingCapsules.Count > 0)
            {
                AddLog($"Found {pendingCapsules.Count} capsules to process.");
                _logger.LogInformation($"[Automation] Found {pendingCapsules.Count} unlocked capsules ready for email delivery at {now}");

                using (var scope = _serviceProvider.CreateScope())
                {
                    var emailService = scope.ServiceProvider.GetRequiredService<EmailService>();

                    foreach (var capsule in pendingCapsules)
                    {
                        try
                        {
                            AddLog($"Sending ID {capsule.CapsuleId} to {capsule.Email}...");
                            _logger.LogInformation($"[Automation] Starting delivery for capsule #{capsule.CapsuleId} to {capsule.Email}");
                            
                            var memories = blMemory.GetMemoriesByCapsule(capsule.CapsuleId);
                            string emailBody = FormatEmailBody(capsule, memories);

                            await emailService.SendEmailAsync(capsule.Email, $"Unlock Your Time Capsule: From {capsule.SenderName}", emailBody);

                            blCapsule.MarkCapsuleAsSent(capsule.CapsuleId);
                            AddLog($"SUCCESS: Sent ID {capsule.CapsuleId}.");
                        }
                        catch (Exception ex)
                        {
                            AddLog($"FAILED ID {capsule.CapsuleId}: {ex.Message}");
                            _logger.LogError(ex, $"[Automation] ERROR: Failed to process capsule #{capsule.CapsuleId}");
                        }
                    }
                }
            }
            else
            {
                LastStatus = "Running (No pending capsules)";
            }
        }

        private string FormatEmailBody(CapsuleClass capsule, List<MemoryClass> memories)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;'>");
            
            // Header
            sb.Append("<div style='background-color: #117f3b; color: white; padding: 20px; text-align: center;'>");
            sb.Append("<h1 style='margin: 0;'>Virtual Time Capsule</h1>");
            sb.Append("<p style='margin: 5px 0 0;'>A journey back in time, just for you.</p>");
            sb.Append("</div>");

            // Content
            sb.Append("<div style='padding: 30px; color: #333;'>");
            sb.Append($"<h2 style='color: #117f3b;'>Hello {capsule.FirstName},</h2>");
            sb.Append($"<p>The wait is over! Your time capsule from <strong>{capsule.SenderName}</strong> has finally unlocked. Below are the memories that were saved for this moment.</p>");

            if (!string.IsNullOrEmpty(capsule.Note))
            {
                sb.Append("<div style='background-color: #f9f9f9; border-left: 4px solid #117f3b; padding: 15px; margin: 20px 0;'>");
                sb.Append($"<strong>Creator's Note:</strong><br/>{capsule.Note}");
                sb.Append("</div>");
            }

            sb.Append("<h3 style='border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;'>📜 Memories Captured</h3>");
            
            if (memories != null && memories.Count > 0)
            {
                sb.Append("<ul style='list-style: none; padding: 0;'>");
                foreach (var memory in memories)
                {
                    sb.Append("<li style='margin-bottom: 25px; padding: 20px; background-color: #fff; border: 1px solid #f0f0f0; border-radius: 8px;'>");
                    
                    if (!string.IsNullOrEmpty(memory.Message))
                    {
                        sb.Append($"<p style='font-style: italic; color: #555; font-size: 16px; margin: 0 0 10px;'>\"{memory.Message}\"</p>");
                    }

                    if (!string.IsNullOrEmpty(memory.FilePath))
                    {
                        string baseUrl = _configuration["EmailSettings:AppBaseUrl"]?.TrimEnd('/') ?? "https://localhost:7279";
                        string fileUrl = $"{baseUrl}/{memory.FilePath.Replace("\\", "/")}";
                        string label = memory.FileType?.Contains("image") == true ? "View Image" : 
                                       memory.FileType?.Contains("video") == true ? "Watch Video" : 
                                       memory.FileType?.Contains("pdf") == true ? "Open PDF" : "View File";
                        
                        sb.Append($"<a href='{fileUrl}' style='display: inline-block; background-color: #117f3b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; margin-top: 5px;'>{label} →</a>");
                    }
                    
                    sb.Append("</li>");
                }
                sb.Append("</ul>");
            }
            else
            {
                sb.Append("<p style='color: #888;'>No individual memories were found in this capsule.</p>");
            }

            sb.Append("</div>");

            // Footer
            sb.Append("<div style='background-color: #f5f5f5; padding: 20px; text-align: center; color: #888; font-size: 12px;'>");
            sb.Append("<p>This is an automated email from your Virtual Time Capsule.</p>");
            sb.Append("<p>&copy; 2026 Virtual Time Capsule Team</p>");
            sb.Append("</div>");

            sb.Append("</div>");
            return sb.ToString();
        }
    }
}
