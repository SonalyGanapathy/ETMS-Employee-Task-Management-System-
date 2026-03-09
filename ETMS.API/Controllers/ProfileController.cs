using ETMS.Application.Models.DTOs;
using ETMS.Domain.Entities;
using ETMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ETMS.API.Controllers
{
    [ApiController]
    [Route("api/profile")]
    public class ProfileController : ControllerBase
    {
        private readonly ETMSDbContext _context;

        public ProfileController(ETMSDbContext context)
        {
            _context = context;
        }

        // 🔹 Get logged-in user's profile
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userIds = Guid.Parse(userIdClaim.Value);

            var emp = _context.Employees
              .FirstOrDefault(x => x.UserId == userIds);

            if (emp == null)
                return NotFound();

            return Ok(new EmployeeProfileDto
            {
                Id = emp.Id,
                EmployeeCode = emp.UserId,
                FirstName = emp.FirstName,
                LastName = emp.LastName,
                Email = emp.Email,
                Department = emp.Department,
                RoleId = emp.RoleId,
                Role = emp.Role,

                PhoneNumber = emp.PhoneNumber,
                DateOfJoining = emp.DateOfJoining,
                Address = emp.Address,
                EmergencyContact = emp.EmergencyContact,
                Skills = emp.Skills
            });
        }

        // 🔹 Update profile
        [HttpPut]
        public async Task<IActionResult> UpdateProfile(
     [FromBody] UpdateEmployeeProfileDto model)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim.Value);

            var emp = await _context.Employees
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (emp == null)
                return NotFound();

            emp.PhoneNumber = model.PhoneNumber;
            emp.DateOfJoining = model.DateOfJoining;
            emp.Address = model.Address;
            emp.EmergencyContact = model.EmergencyContact;
            emp.Skills = model.Skills;

            await _context.SaveChangesAsync();
            return Ok();
        }

    }
}