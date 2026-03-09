using ETMS.API.Services;
using ETMS.Application.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace ETMS.API.Controllers
{
    using ETMS.Domain.Entities;
    using ETMS.Infrastructure.Persistence;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using System.Security.Claims;

    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // ✅ REQUIRED
    public class TaskAssignmentController : ControllerBase
    {
        private readonly ETMSDbContext _context;

        public TaskAssignmentController(ETMSDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CreateTask([FromBody] TaskAssignmentCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);

            var task = new TaskAssignment
            {
                Id = Guid.NewGuid(),
                TaskName = dto.TaskName,
                Comment = dto.Comment,
                AssignedToUserId = dto.AssignedToUserId,
                AssignedByUserId = userId,
                Status = dto.Status,
                TimeTaken = dto.TimeTaken,
                CreatedDate = DateTime.UtcNow
            };

            _context.TaskAssignments.Add(task);
            _context.SaveChanges();

            return Ok(new { message = "Task created successfully", taskId = task.Id });
        }

        [HttpGet]
        public IActionResult GetAllTasks()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);

            // Logged-in employee details
            var loggedEmployee = _context.Employees
                .FirstOrDefault(e => e.UserId == userId);

            if (loggedEmployee == null)
                return Unauthorized("Employee not found");

            IQueryable<TaskAssignment> query = _context.TaskAssignments;

            /* ================= ADMIN ================= */
            if (loggedEmployee.Role == "Admin")
            {
                // No filter – all tasks
            }

            /* ================= MANAGER ================= */
            else if (loggedEmployee.Role == "Manager")
            {
                query = query.Where(t =>
                    _context.Employees
                        .Where(e => e.DepartmentId == loggedEmployee.DepartmentId)
                        .Select(e => e.UserId)
                        .Contains(t.AssignedToUserId)
                );
            }

            /* ================= EMPLOYEE ================= */
            else
            {
                query = query.Where(t => t.AssignedToUserId == userId);
            }

            var tasks = query
                .Select(t => new TaskAssignmentViewDto
                {
                    Id = t.Id,
                    TaskName = t.TaskName,
                    Status = t.Status,
                    Comment = t.Comment,
                    TimeTaken = t.TimeTaken,

                    AssignedToUserId = t.AssignedToUserId,
                    AssignedToUserName = _context.Users
                        .Where(u => u.Id == t.AssignedToUserId)
                        .Select(u => u.Employee.FirstName + " " + u.Employee.LastName)
                        .FirstOrDefault() ?? string.Empty,

                    AssignedByUserId = t.AssignedByUserId,
                    AssignedByUserName = _context.Users
                        .Where(u => u.Id == t.AssignedByUserId)
                        .Select(u => u.Employee.FirstName + " " + u.Employee.LastName)
                        .FirstOrDefault() ?? string.Empty
                   

                })
                .ToList();

            return Ok(tasks);
        }


        [HttpGet("{id}")]
        public IActionResult GetTaskById(Guid id)
        {

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);

            // Logged-in employee details
            var loggedEmployee = _context.Employees
                .FirstOrDefault(e => e.UserId == userId);
            var task = _context.TaskAssignments
                .Where(t => t.Id == id)
                .Select(t => new TaskAssignmentViewDto
                {
                    Id = t.Id,
                    TaskName = t.TaskName,
                    Status = t.Status,
                    Comment = t.Comment,
                    TimeTaken = t.TimeTaken,

                    AssignedToUserId = t.AssignedToUserId,
                    AssignedToUserName = _context.Users
                        .Where(u => u.Id == t.AssignedToUserId)
                        .Select(u => u.Employee.FirstName + " "+ u.Employee.LastName)
                        .FirstOrDefault() ?? string.Empty,

                    AssignedByUserId = t.AssignedByUserId,
                    AssignedByUserName = _context.Users
                        .Where(u => u.Id == t.AssignedByUserId)
                        .Select(u => u.Employee.FirstName + " " + u.Employee.LastName)
                        .FirstOrDefault() ?? string.Empty,
                    ReviewComment = t.ReviewComment,
                    ReviewMarks = t.ReviewMarks

                })
                .FirstOrDefault();

            if (task == null)
                return NotFound();

            return Ok(task);
        }

        [HttpPut("{id}/review")]
        public IActionResult UpdateTaskReview(Guid id, TaskReviewUpdateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim.Value);

            var loggedEmployee = _context.Employees
                .FirstOrDefault(e => e.UserId == userId);

            if (loggedEmployee == null)
                return Unauthorized();

            // Only Manager or Admin can update review
            if (loggedEmployee.Role != "Manager" && loggedEmployee.Role != "Admin")
                return Forbid("Employees are not allowed to review tasks");

            var task = _context.TaskAssignments.FirstOrDefault(t => t.Id == id);
            if (task == null)
                return NotFound();

            // 🔥 Status validation
            if (task.Status != 2) // 2 = Completed
                return BadRequest("Review can be added only when task is completed");

            // 🔥 Marks validation
            if (dto.ReviewMarks == null || dto.ReviewMarks < 1 || dto.ReviewMarks > 5)
                return BadRequest("Review marks must be between 1 and 5");

            task.ReviewComment = dto.ReviewComment;
            task.ReviewMarks = dto.ReviewMarks;

            _context.SaveChanges();

            return Ok("Review updated successfully");
        }


        [HttpPut("{id}")]
        public IActionResult UpdateTask(Guid id, [FromBody] TaskAssignmentUpdateDto dto)
        {
            var task = _context.TaskAssignments.FirstOrDefault(t => t.Id == id);
            if (task == null)
                return NotFound();

            task.TaskName = dto.TaskName;
            task.Status = dto.Status;
            task.Comment = dto.Comment;
            task.AssignedToUserId = dto.AssignedToUserId;
            task.TimeTaken = dto.TimeTaken;

            _context.SaveChanges();
            return Ok(new { message = "Task updated successfully" });
        }

        [HttpPost("performance/preview")]
        public IActionResult PreviewPerformance(PerformanceFilterDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);

            var loggedEmployee = _context.Employees
                .FirstOrDefault(e => e.UserId == userId);

            if (loggedEmployee.Role != "Manager" && loggedEmployee.Role != "Admin")
                return Forbid();

            var tasks = _context.TaskAssignments
                .Where(t =>
                    t.AssignedToUserId == dto.EmployeeUserId &&
                    t.Status == 2 && // Completed
                    t.ReviewMarks != null &&
                    t.CreatedDate.Year == dto.Year &&
                    (dto.Month == null || t.CreatedDate.Month == dto.Month) &&
                    (dto.Week == null || EF.Functions.DateDiffWeek(
                        new DateTime(dto.Year, 1, 1), t.CreatedDate) == dto.Week)
                )
                .ToList();

            if (!tasks.Any())
                return Ok(new { average = 0, count = 0 });

            var average = tasks.Average(t => t.ReviewMarks);
            return Ok(new
            {
                averageScore = Math.Round(average, 2),
            taskCount = tasks.Count
            });
        }

        [HttpPost("performance/publish")]
        public IActionResult PublishPerformance(PublishPerformanceDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);

            var loggedEmployee = _context.Employees
                .FirstOrDefault(e => e.UserId == userId);

            if (loggedEmployee.Role != "Manager" && loggedEmployee.Role != "Admin")
                return Forbid();

            var tasks = _context.TaskAssignments
                .Where(t =>
                    t.AssignedToUserId == dto.EmployeeUserId &&
                    t.Status == 2 &&
                    t.ReviewMarks != null &&
                    t.CreatedDate.Year == dto.Year &&
                    (dto.Month == null || t.CreatedDate.Month == dto.Month) &&
                    (dto.Week == null || EF.Functions.DateDiffWeek(
                        new DateTime(dto.Year, 1, 1), t.CreatedDate) == dto.Week)
                )
                .ToList();

            if (!tasks.Any())
                return BadRequest("No reviewed tasks found");

            var avg = tasks.Average(t => t.ReviewMarks);

            var summary = new EmployeePerformanceSummary
            {
                EmployeeUserId = dto.EmployeeUserId,
                Year = dto.Year,
                Month = dto.Month,
                Week = dto.Week,
                AverageScore = Math.Round(avg, 2),
                ManagerComment = dto.ManagerComment,
                IsPublished = true,
                ReviewedByUserId = loggedEmployee.UserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.EmployeePerformanceSummaries.Add(summary);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Performance published successfully"
            });

        }

        [HttpGet("performance/my")]
        public IActionResult GetMyPerformance()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);

            var loggedEmployee = _context.Employees
                .FirstOrDefault(e => e.UserId == userId);

            var summaries = _context.EmployeePerformanceSummaries
                .Where(p =>
                    p.EmployeeUserId == userId &&
                    p.IsPublished)
                .OrderByDescending(p => p.CreatedAt)
                .ToList();

            return Ok(summaries);
        }

    }

}