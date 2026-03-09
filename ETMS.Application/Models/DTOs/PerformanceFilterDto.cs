using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Application.Models.DTOs
{
    public class PerformanceFilterDto
    {
        public Guid EmployeeUserId { get; set; }
        public int Year { get; set; }
        public int? Month { get; set; }
        public int? Week { get; set; }
    }

}
