using ETMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace ETMS.API.Controllers
{
    [ApiController]
    [Route("api/departments")]
    public class DepartmentController : ControllerBase
    {
        private readonly ETMSDbContext _context;

        public DepartmentController(ETMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetDepartments()
        {
            return Ok(_context.Department.ToList());
        }
    }
}
