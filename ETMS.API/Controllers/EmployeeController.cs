using ETMS.Application.Models.DTOs;
using ETMS.Domain.Entities;
using ETMS.Domain.Enums;
using ETMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;


namespace ETMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly ETMSDbContext _context;

        public EmployeeController(ETMSDbContext context)
        {
            _context = context;
        }


        [Authorize(Policy = "AdminOrManager")]
        [HttpGet("GetDahboardDetails")]
    
        public IActionResult GetDashboardDetails()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);

            var result = _context.EmployeeDashboardDto
                .FromSqlRaw(
                    "EXEC GetDashboardDetails @UserId",
                    new SqlParameter("@UserId", userId)
                )
                .ToList();

            return Ok(result);
        }

        [Authorize]
        [HttpGet("claims")]
        public IActionResult GetClaims()
        {
            return Ok(User.Claims.Select(c => new
            {
                c.Type,
                c.Value
            }));
        }


        [HttpGet]
        public IActionResult GetEmployees()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);

            // Get logged-in user's role & department
            var loggedInUser = _context.Employees
                .Where(e => e.UserId == userId)
                .Select(e => new { e.Role, e.DepartmentId, e.UserId })
                .FirstOrDefault();

            if (loggedInUser == null)
                return Unauthorized("Employee record not found");

            IQueryable<Employee> query = _context.Employees;

            // ADMIN → All employees
            if (loggedInUser.Role == "Admin")
            {
                // no filter
            }
            // MANAGER → Same department employees
            else if (loggedInUser.Role == "Manager")
            {
                query = query.Where(e => e.DepartmentId == loggedInUser.DepartmentId);
            }
            // EMPLOYEE → Only self (optional)
            else
            {
                query = query.Where(e => e.UserId == userId);
            }

            var employees = query.ToList();

            return Ok(employees);
        }

        [HttpPost]
        public IActionResult CreateEmployee(Employee employee)
        {
            _context.Employees.Add(employee);
            _context.SaveChanges();

            return Ok(employee);
        }

        [HttpPost("UpdateAttendance")]
        public IActionResult UpdateAttendance(UpdateAttendance model)
        {

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);

            var today = DateTime.Today;

            var attendance = _context.UpdateAttendance
                .FirstOrDefault(a => a.EmployeeCode == userId
                                  && a.AttendanceDate == today);

            if (attendance == null)
            {
                attendance = new UpdateAttendance
                {
                    Id = Guid.NewGuid(),
                    EmployeeCode = userId,
                    AttendanceDate = today,
                    // FIX: Cast the StatusId coming from the frontend to the Enum type
                    StatusId = model.StatusId,
                    Status = (AttendanceStatus)model.StatusId,
                    CheckInTime = DateTime.Now,
                    CreatedAt = model.CreatedAt,
                    UpdatedAt = model.UpdatedAt
                };
                _context.UpdateAttendance.Add(attendance);
            }
            else
            {
                attendance.StatusId = model.StatusId;
                attendance.Status = (AttendanceStatus)model.Status;
                attendance.Remarks = model.Remarks;
                attendance.UpdatedAt = DateTime.Now;
            }

            _context.SaveChanges();
            return Ok(attendance);
        }


        [HttpGet("UpdateAttendance")]
        public IActionResult GetUpdatedAttendance()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);

            var attendance = _context.UpdatedAttendanceDtos
    .FromSqlRaw(
        "EXEC GetUpdatedAttendance @UserId",
        new SqlParameter("@UserId", userId)
    )
    .ToList();

            return Ok(attendance);
        }

        [HttpPost("LeaveRequest")]
        public IActionResult SendLeaveRequest([FromBody] LeaveRequestDto model)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not logged in");

            var employeeCode = Guid.Parse(userIdClaim.Value);

            var employee = _context.Employees
                .FirstOrDefault(e => e.UserId == employeeCode);

            if (employee == null)
                return BadRequest("Employee not found");

            var leave = new LeaveRequest
            {
                Id = Guid.NewGuid(),
                EmployeeCode = employeeCode,
                EmployeeName = employee.FirstName + " " + employee.LastName,
                Department = employee.Department,
                Role = employee.Role,
                FromDate = model.FromDate,
                ToDate = model.ToDate,
                Reason = model.Reason,
                Status = LeaveStatus.Pending,
                CreatedAt = DateTime.Now
            };

            _context.LeaveRequests.Add(leave);
            _context.SaveChanges();

            return Ok(new { message = "Leave request submitted successfully" });
        }


        [HttpGet("LeaveRequests")]
        public IActionResult GetLeaveRequests()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("UserId claim not found");

            var userId = Guid.Parse(userIdClaim.Value);

            var loggedInUser = _context.Employees
                .Where(e => e.UserId == userId)
                .Select(e => new { e.Role, e.DepartmentId })
                .FirstOrDefault();

            if (loggedInUser == null)
                return Unauthorized("Employee not found");

            var leavesQuery =
                from l in _context.LeaveRequests
                join e in _context.Employees
                    on l.EmployeeCode equals e.UserId
                where
                    loggedInUser.Role == "Admin"
                    || (loggedInUser.Role == "Manager"
                        && e.DepartmentId == loggedInUser.DepartmentId)
                    || (loggedInUser.Role == "Employee"
                        && e.UserId == userId)
                select new
                {
                    l.Id,
                    l.EmployeeCode,
                    l.FromDate,
                    l.ToDate,
                    l.EmployeeName,
                    l.Department,
                    l.Role,
                    Status = l.Status.ToString()
                };

            return Ok(leavesQuery.ToList());
        }


        [HttpGet("LeaveRequest/{id}")]
        public IActionResult GetLeaveRequestById(Guid id)
        {
            var leave = _context.LeaveRequests
                .Where(l => l.Id == id)
                .Select(l => new
                {
                    l.Id,
                    l.EmployeeCode,
                    l.EmployeeName,
                    l.Department,
                    l.Role,
                    FromDate = l.FromDate,
                    ToDate = l.ToDate,
                    l.Reason,
                    Status = l.Status.ToString()
                })
                .FirstOrDefault();

            if (leave == null)
                return NotFound("Leave request not found");

            return Ok(leave);
        }




        [HttpPut("LeaveRequest/{id}")]
        public IActionResult UpdateLeaveRequestStatus( Guid id, [FromBody] UpdateLeaveStatusDto model)
        {
            var leave = _context.LeaveRequests.FirstOrDefault(l => l.Id == id);

            if (leave == null)
                return NotFound("Leave request not found");

            
            leave.Status = (LeaveStatus)model.Status;
            leave.UpdatedAt = DateTime.Now;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Leave status updated successfully",
                status = leave.Status.ToString()
            });
        }

    }
}
