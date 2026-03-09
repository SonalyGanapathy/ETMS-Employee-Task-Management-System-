using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Application.Models.DTOs
{
    public class EmployeeDashboardDto
    {
        public int ActiveEmployees { get; set; }
        public int PresentEmployees { get; set; }
        public int PendingLeaveRequests { get; set; }
        public int EmployeesOnLeave { get; set; }
    }

}
