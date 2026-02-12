using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortalApi.Migrations
{
    /// <inheritdoc />
    public partial class AddEducationAndExperience : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Education",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Experience",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Education",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "Jobs");
        }
    }
}
