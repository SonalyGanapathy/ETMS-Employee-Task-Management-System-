using System.Collections.Generic;

namespace ETMS.Domain.Entities
{
    public class Role
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        public ICollection<User> Users { get; set; }
    }
}
