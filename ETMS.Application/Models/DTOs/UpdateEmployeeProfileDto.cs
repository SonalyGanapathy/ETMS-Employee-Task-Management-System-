using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Application.Models.DTOs
{
    public class UpdateEmployeeProfileDto
    {
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfJoining { get; set; }
        public string? Address { get; set; }
        public string? EmergencyContact { get; set; }
        public string? Skills { get; set; }
    }

}
