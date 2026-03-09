using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace ETMS.Application.Models.DTOs
{

    public class TaskAssignmentCreateDto
    {
        [Required]
        public string TaskName { get; set; }

        [Required]
        public int Status { get; set; }   // 🚨 INT, NOT STRING

        public string? Comment { get; set; }

        [Required]
        public Guid AssignedToUserId { get; set; }

        public decimal TimeTaken { get; set; }
    }



}
