using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Application.Models.DTOs
{
    public class TaskAssignmentUpdateDto
    {
        public string TaskName { get; set; }
        public int Status { get; set; }
        public string? Comment { get; set; }
        public Guid AssignedToUserId { get; set; }
        public decimal TimeTaken { get; set; }
    }

}
