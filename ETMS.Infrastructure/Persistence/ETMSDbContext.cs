using ETMS.Application.Models.DTOs;
using ETMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace ETMS.Infrastructure.Persistence
{
    public class ETMSDbContext : DbContext
    {
        public ETMSDbContext(DbContextOptions<ETMSDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<Department> Department { get; set; }
        public DbSet<TaskAssignment> TaskAssignments { get; set; }
        public DbSet<UpdateAttendance> UpdateAttendance { get; set; }
        public DbSet<UpdatedAttendanceDto> UpdatedAttendanceDtos { get; set; }
        public DbSet<EmployeeDashboardDto> EmployeeDashboardDto { get; set; }
        public DbSet<EmployeePerformanceSummary> EmployeePerformanceSummaries { get; set; }


        public DbSet<LeaveRequest> LeaveRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UpdatedAttendanceDto>().HasNoKey();

            modelBuilder.Entity<TaskAssignment>()
       .Property(t => t.ReviewMarks)
       .HasPrecision(2, 1); // e.g. 4.5 max

            modelBuilder.Entity<EmployeePerformanceSummary>()
       .Property(t => t.AverageScore)
       .HasPrecision(2, 1); // e.g. 4.5 max

            modelBuilder.Entity<Role>().HasData(
    new Role { Id = 1, Name = "Admin", IsActive = true },
    new Role { Id = 2, Name = "Manager", IsActive = true },
    new Role { Id = 3, Name = "Employee", IsActive = true }
);

            modelBuilder.Entity<Department>().HasData(
                new Department { Id = 1, Name = "IT" },
                new Department { Id = 2, Name = "HR" },
                new Department { Id = 3, Name = "Finance" }
            );

            modelBuilder.Entity<EmployeeDashboardDto>().HasNoKey().ToView(null); 
            modelBuilder.Entity<UpdateAttendance>().Property(a => a.Status).HasConversion<string>();

            modelBuilder.Entity<TaskAssignment>(entity =>
            {
                entity.Property(e => e.TimeTaken)
                      .HasPrecision(5, 2);
            });

            // User → Role
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // User ↔ Employee (1–1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Employee)
                .WithOne(e => e.User)
                .HasForeignKey<Employee>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // TaskItem → AssignedTo (NO CASCADE)
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.AssignedTo)
                .WithMany()
                .HasForeignKey(t => t.AssignedToEmployeeId)
                .OnDelete(DeleteBehavior.NoAction);

            // TaskItem → AssignedBy (NO CASCADE)
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.AssignedBy)
                .WithMany()
                .HasForeignKey(t => t.AssignedByManagerId)
                .OnDelete(DeleteBehavior.NoAction);


        }

    }


}
