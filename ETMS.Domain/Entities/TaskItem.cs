using System;
using System.Collections.Generic;
using ETMS.Domain.Enums;

namespace ETMS.Domain.Entities
{
    public class TaskItem
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public Guid AssignedToEmployeeId { get; set; }
        public Employee AssignedTo { get; set; }

        public Guid AssignedByManagerId { get; set; }
        public Employee AssignedBy { get; set; }

        public Enums.TaskStatus Status { get; set; }

        public int? Marks { get; set; }
        public string? ReviewComment { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
