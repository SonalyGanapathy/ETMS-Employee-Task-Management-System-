using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ETMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addingextracolumnAssignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReviewComment",
                table: "TaskAssignments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "ReviewMarks",
                table: "TaskAssignments",
                type: "decimal(2,1)",
                precision: 2,
                scale: 1,
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReviewComment",
                table: "TaskAssignments");

            migrationBuilder.DropColumn(
                name: "ReviewMarks",
                table: "TaskAssignments");
        }
    }
}
