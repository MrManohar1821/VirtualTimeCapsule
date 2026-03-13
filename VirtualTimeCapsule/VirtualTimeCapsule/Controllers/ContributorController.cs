using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VirtualTimeCapsule.BusinessLayer;
using VirtualTimeCapsule.Models;

namespace VirtualTimeCapsule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContributorController : ControllerBase
    {
       
        
            [HttpPost("invite")]
            public IActionResult InviteContributor([FromBody] ContributorClass contributor)
            {
                if (contributor == null)
                    return BadRequest("Invalid contributor data");

                BLContributor bl = new BLContributor();

                bool result = bl.InsertContributor(contributor);

                if (result)
                    return Ok("Invitation sent successfully");

                return BadRequest("Invitation failed");
            }
        
    }
}
