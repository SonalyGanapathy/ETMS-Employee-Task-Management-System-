using ETMS.Domain.Enums;
using System;

namespace ETMS.Domain.Entities
{
    public class UpdateAttendance
    {
        public Guid Id { get; set; }

        public Guid EmployeeCode { get; set; }

        public DateTime AttendanceDate { get; set; }

        public int StatusId { get; set; }
        public AttendanceStatus Status { get; set; }   // Navigation (EF)

        public DateTime? CheckInTime { get; set; }

        public DateTime? CheckOutTime { get; set; }

        public string Remarks { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
