using System;
using System.Collections.Generic;
using System.Text;
using ETMS.Domain.Enums;

namespace ETMS.Application.Models.DTOs
{
    public class UpdateLeaveStatusDto
    {
        public int Status { get; set; } // "Approved" | "Rejected"
    }


}
