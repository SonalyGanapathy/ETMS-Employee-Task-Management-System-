using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Application.Models.DTOs
{
    public class LeaveRequestDto
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Reason { get; set; }
    }

}
