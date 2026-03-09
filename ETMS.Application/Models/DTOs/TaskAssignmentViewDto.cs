using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Application.Models.DTOs
{
    public class TaskAssignmentViewDto
    {
        public Guid Id { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public int Status { get; set; }
        public string? Comment { get; set; }
        public decimal TimeTaken { get; set; }
        public Guid AssignedToUserId { get; set; }
        public string AssignedToUserName { get; set; } = string.Empty;

        public Guid AssignedByUserId { get; set; }
        public string AssignedByUserName { get; set; } = string.Empty;

        public string ReviewComment { get; set; }

        public decimal ReviewMarks { get; set; }
    }

}
