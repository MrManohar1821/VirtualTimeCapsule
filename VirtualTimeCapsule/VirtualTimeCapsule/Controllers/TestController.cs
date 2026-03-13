using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace VirtualTimeCapsule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new
            {
                message = "Backend is reachable!",
                serverTime = DateTime.Now,
                clientIp = HttpContext.Connection.RemoteIpAddress?.ToString()
            });
        }

        [HttpGet("diag")]
        public IActionResult DetailedDiagnostics()
        {
            try
            {
                VirtualTimeCapsule.DataLayer.SqlServerDB db = new VirtualTimeCapsule.DataLayer.SqlServerDB();
                
                // Check SQL Time vs App Time
                var timeDt = db.GetDataTable("SELECT GETDATE() AS SqlTime");
                DateTime sqlTime = Convert.ToDateTime(timeDt.Rows[0]["SqlTime"]);

                // Check Active Capsules count
                var activeDt = db.GetDataTable("SELECT COUNT(*) AS ActiveCount FROM CAPSULES WHERE STATUS = 'ACTIVE'");
                int activeCount = Convert.ToInt32(activeDt.Rows[0]["ActiveCount"]);

                // Check Unlocked Capsules (using the query logic)
                var unlockedDt = db.GetDataTable(@"
                    SELECT C.CAPSULEID, IC.UNLOCKDATE, IC.UNLOCKTIME 
                    FROM CAPSULES C 
                    JOIN INVITE_CONTRIBUTOR IC ON C.CAPSULEID = IC.CAPSULEID 
                    WHERE C.STATUS = 'ACTIVE'");

                var results = new System.Collections.Generic.List<object>();
                foreach (DataRow row in unlockedDt.Rows)
                {
                    results.Add(new {
                        Id = row["CAPSULEID"],
                        Date = row["UNLOCKDATE"],
                        Time = row["UNLOCKTIME"]
                    });
                }

                return Ok(new
                {
                    appTime = DateTime.Now,
                    sqlTime = sqlTime,
                    activeCapsulesInDb = activeCount,
                    unlockedCapsulesFound = results,
                    timezoneOffset = DateTimeOffset.Now.Offset.ToString(),
                    automation = new {
                        status = Services.CapsuleAutomationService.LastStatus,
                        lastCheck = Services.CapsuleAutomationService.LastRunTime,
                        logs = Services.CapsuleAutomationService.AutomationLogs
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
