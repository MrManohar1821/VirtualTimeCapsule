using Microsoft.AspNetCore.Mvc;
using VirtualTimeCapsule.BusinessLayer;

[Route("api/[controller]")]
[ApiController]
public class CapsuleController : ControllerBase
{

    [HttpPost("create")]
    public IActionResult CreateCapsule(int userId)
    {
        if (userId <= 0)
            return BadRequest("Invalid UserId");

        BLCapsule bl = new BLCapsule();

        int capsuleId = bl.CreateCapsule(userId);

        return Ok(new
        {
            capsuleId = capsuleId
        });
    }


    [HttpGet("user/{userId}")]
    public IActionResult GetCapsulesByUser(int userId)
    {
        BLCapsule bl = new BLCapsule();

        var capsules = bl.GetCapsulesByUser(userId);

        return Ok(capsules);
    }


    [HttpDelete("delete/{capsuleId}")]
    public IActionResult DeleteCapsule(int capsuleId)
    {
        BLCapsule bl = new BLCapsule();

        bool deleted = bl.DeleteCapsule(capsuleId);

        return Ok(deleted);
    }


    [HttpPut("activate/{capsuleId}")]
    public IActionResult ActivateCapsule(int capsuleId)
    {
        BLCapsule bl = new BLCapsule();

        bool activated = bl.ActivateCapsule(capsuleId);

        if (!activated)
            return NotFound();

        return Ok();
    }

    [HttpGet("details/{capsuleId}")]
    public IActionResult GetCapsuleDetails(int capsuleId)
    {
        BLMemory bl = new BLMemory();

        var memories = bl.GetMemoriesByCapsule(capsuleId);

        return Ok(new
        {
            memories = memories
        });
    }
}