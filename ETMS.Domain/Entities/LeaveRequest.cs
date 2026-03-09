using ETMS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Domain.Entities
{
    public class LeaveRequest
    {
        public Guid Id { get; set; }
        public Guid EmployeeCode { get; set; }

        public string EmployeeName { get; set; }
        public string Department { get; set; }
        public string Role { get; set; }

        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

        public string Reason { get; set; }
        public LeaveStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

}
