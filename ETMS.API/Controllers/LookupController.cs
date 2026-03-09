using ETMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace ETMS.API.Controllers
{
    [ApiController]
    [Route("api/lookup")]
    public class LookupController : ControllerBase
    {
        private readonly ETMSDbContext _context;

        public LookupController(ETMSDbContext context)
        {
            _context = context;
        }

        [HttpGet("roles")]
        public IActionResult GetRoles()
        {
            return Ok(_context.Roles.ToList());
        }

        [HttpGet("departments")]
        public IActionResult GetDepartments()
        {
            return Ok(_context.Department.ToList());
        }
    }

}
