using ETMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace ETMS.API.Controllers
{
    [ApiController]
    [Route("api/role")]
    public class RoleController : ControllerBase
    {
        private readonly ETMSDbContext _context;

        public RoleController(ETMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetRoles()
        {
            return Ok(_context.Roles.ToList());
        }
    }
}
