using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Application.Models
{
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public int DepartmentId { get; set; }
        public string Department { get; set; }

        public int RoleId { get; set; }
        public string Role { get; set; }
    }


}
