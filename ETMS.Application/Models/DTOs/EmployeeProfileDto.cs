using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Application.Models.DTOs
{
    public class EmployeeProfileDto
    {
        // Read Only
        public Guid Id { get; set; }
        public Guid EmployeeCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Department { get; set; }
        public int RoleId { get; set; }
        public string Role { get; set; }

        // Editable
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfJoining { get; set; }
        public string? Address { get; set; }
        public string? EmergencyContact { get; set; }
        public string? Skills { get; set; }
    }

}
