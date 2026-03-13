using Microsoft.AspNetCore.Mvc;
using VirtualTimeCapsule.BusinessLayer;

[Route("api/[controller]")]
[ApiController]
public class DashboardStaticsController : ControllerBase
{
    [HttpGet("counts")]
    public IActionResult GetStats()
    {
        BLDashboard bl = new BLDashboard();
        var stats = bl.GetDashboardStatistics();
        return Ok(stats);
    }

    [HttpGet("UserInfo")]
    public IActionResult GetUserInfo()
    {
        BLDashboard bl = new BLDashboard();
        var users = bl.GetUserInfo();
        return Ok(users);
    }

    [HttpDelete("DeleteUser/{userId}")]
    public IActionResult DeleteUser(int userId)
    {
        BLDashboard bl = new BLDashboard();
        bool result = bl.DeleteUser(userId);
        if (result)
            return Ok(new { message = "User deleted successfully" });
        return BadRequest(new { message = "Failed to delete user" });
    }

    [HttpGet("CapsulesInfo")]
    public IActionResult GetCapsulesInfo()
    {
        BLDashboard bl = new BLDashboard();
        var capsules = bl.GetCapsulesInfo();
        return Ok(capsules);
    }
}
