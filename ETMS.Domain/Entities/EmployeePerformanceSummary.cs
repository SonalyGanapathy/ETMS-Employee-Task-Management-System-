using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Domain.Entities
{
    public class EmployeePerformanceSummary
    {
        public Guid Id { get; set; }
        public Guid EmployeeUserId { get; set; }

        public int Year { get; set; }
        public int? Month { get; set; }   // null if weekly
        public int? Week { get; set; }    // null if monthly

        public decimal AverageScore { get; set; } // out of 5
        public string? ManagerComment { get; set; }

        public bool IsPublished { get; set; } // 🔥 controls visibility

        public Guid ReviewedByUserId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
