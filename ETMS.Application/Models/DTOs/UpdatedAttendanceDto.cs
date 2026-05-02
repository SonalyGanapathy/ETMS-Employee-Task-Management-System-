namespace ETMS.Application.Models.DTOs
{
    public class UpdatedAttendanceDto
    {
        public string EmployeeName { get; set; }
        public string Department { get; set; }
        public string Role { get; set; }
        public string Remarks { get; set; }
        public DateTime Date { get; set; }
        public DateTime CheckInTime { get; set; }
        public string Status { get; set; }
    }
}