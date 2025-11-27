// a helper base class for all your API controllers. Sets the default route so dn to repeat this in every controller.

using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
    }
}
