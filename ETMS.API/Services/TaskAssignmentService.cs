using ETMS.Application.Models.DTOs;
using ETMS.Domain.Entities;
using ETMS.Infrastructure.Persistence;

namespace ETMS.API.Services
{
    public class TaskAssignmentService
    {
        private readonly ETMSDbContext _context;

        public TaskAssignmentService(ETMSDbContext context)
        {
            _context = context;
        }

        public void CreateTask(TaskAssignmentCreateDto dto)
        {
            var task = new TaskAssignment
            {
                TaskName = dto.TaskName,
                Status = dto.Status,
                Comment = dto.Comment,
                AssignedToUserId = dto.AssignedToUserId,
                TimeTaken = dto.TimeTaken
            };

            _context.TaskAssignments.Add(task);
            _context.SaveChanges();
        }
    }
}
