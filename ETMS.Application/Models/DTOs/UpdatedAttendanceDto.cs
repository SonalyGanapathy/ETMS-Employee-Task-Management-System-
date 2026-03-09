using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Application.Models.DTOs
{
    public class UpdatedAttendanceDto
    {
        public string EmployeeName { get; set; }
        public string Department { get; set; }
        public string Role { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
    }

}
