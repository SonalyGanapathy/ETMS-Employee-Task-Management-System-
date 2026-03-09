using System;

namespace ETMS.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        // FK → Role
        public int RoleId { get; set; }
        public Role Role { get; set; }

        // Navigation
        public Employee Employee { get; set; }
    }
}
