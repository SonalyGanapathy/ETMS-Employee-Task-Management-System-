using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ETMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCheckInAndRemarks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CheckInTime",
                table: "UpdatedAttendanceDtos",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "UpdatedAttendanceDtos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckInTime",
                table: "UpdatedAttendanceDtos");

            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "UpdatedAttendanceDtos");
        }
    }
}
