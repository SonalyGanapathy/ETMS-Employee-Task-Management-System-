using ETMS.Application.Models;
using ETMS.Domain.Entities;
using ETMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ETMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ETMSDbContext _context;
        private readonly IConfiguration _configuration;
        public AuthController(ETMSDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Email == request.Email);

            if (user == null ||
                !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            // 🔥 FETCH EMPLOYEE DATA
            var employee = _context.Employees
                .FirstOrDefault(e => e.UserId == user.Id);

            if (employee == null)
                return Unauthorized("Employee record not found");

            var token = GenerateJwtToken(user, employee);

            return Ok(new { token });
        }



        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            // 1. Check email exists
            var existingUser = _context.Users
                .FirstOrDefault(u => u.Email == request.Email);

            if (existingUser != null)
                return BadRequest("Email already exists");

            // 2. Create User
            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                RoleId = request.RoleId
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            // 3. Create Employee
            var employee = new Employee
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                DepartmentId = request.DepartmentId,
                Department = request.Department,
                RoleId = request.RoleId,
                Role = request.Role,
                Email = request.Email,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UserId = user.Id
            };


            _context.Employees.Add(employee);
            _context.SaveChanges();

            return Ok("User registered successfully");
        }


        private string GenerateJwtToken(User user, Employee employee)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),

        // ✅ REQUIRED FOR AUTHORIZATION
        new Claim(ClaimTypes.Role, employee.Role),        // Admin / Manager / Employee
        new Claim("Department", employee.Department),     // HR / IT / Finance

        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    int.Parse(jwtSettings["DurationInMinutes"])
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
}