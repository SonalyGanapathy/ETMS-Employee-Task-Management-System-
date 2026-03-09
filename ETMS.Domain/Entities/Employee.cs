using System;

namespace ETMS.Domain.Entities
{
    public class Employee
    {
        public Guid Id { get; set; }

        public string EmployeeCode { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int DepartmentId { get; set; }
        public string Department { get; set; } = string.Empty;

        public int RoleId { get; set; }
        public string Role { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        // FK → User
        public Guid UserId { get; set; }
        public User User { get; set; }

        public ICollection<TaskItem> Tasks { get; set; }


        public string? PhoneNumber { get; set; }
        public DateTime? DateOfJoining { get; set; }
        public string? Address { get; set; }
        public string? EmergencyContact { get; set; }
        public string? Skills { get; set; }
    }
}
