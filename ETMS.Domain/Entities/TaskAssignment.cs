using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ETMS.Domain.Entities
{
    public class TaskAssignment
    {
        [Key]
        public Guid Id { get; set; }

        public string TaskName { get; set; }

        public int Status { get; set; }

        public string Comment { get; set; }

        [Required]
        public Guid AssignedToUserId { get; set; }
        public Guid AssignedByUserId { get; set; }

        public decimal TimeTaken { get; set; } // hours

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string ReviewComment { get; set; }

        public decimal ReviewMarks { get; set; }

    }
}
