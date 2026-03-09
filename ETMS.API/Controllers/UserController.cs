using ETMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace ETMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ETMSDbContext _context;

        public UserController(ETMSDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users
                .Join(
                    _context.Employees,
                    u => u.Id,
                    e => e.UserId,
                    (u, e) => new
                    {
                        id = u.Id,
                        name = e.FirstName + " " + e.LastName
                    }
                )
                .ToList();

            return Ok(users);
        }

    }
}
