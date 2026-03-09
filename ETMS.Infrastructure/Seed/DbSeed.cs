using ETMS.Domain.Entities;
using ETMS.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Text;

namespace ETMS.Infrastructure.Seed
{
    public static class DbSeeder
    {
        public static void Seed(ETMSDbContext context)
        {
            if (!context.Roles.Any())
            {
                context.Roles.AddRange(
                    new Role { Name = "Admin" },
                    new Role { Name = "Manager" },
                    new Role { Name = "Employee" }
                );
            }

            if (!context.Department.Any())
            {
                context.Department.AddRange(
                    new Department { Name = "IT" },
                    new Department { Name = "HR" },
                    new Department { Name = "Finance" }
                );
            }

            context.SaveChanges();
        }
    }
}
