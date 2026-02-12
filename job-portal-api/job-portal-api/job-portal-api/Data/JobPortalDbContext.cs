using Microsoft.EntityFrameworkCore;
using JobPortalApi.Models;

namespace JobPortalApi.Data;

public class JobPortalDbContext : DbContext
{
    public JobPortalDbContext(DbContextOptions<JobPortalDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<User> Users { get; set; }
    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<JobApplication> JobApplications { get; set; }
    public DbSet<MockTest> MockTests { get; set; }
    public DbSet<TestResult> TestResults { get; set; }
    public DbSet<SavedJob> SavedJobs { get; set; }
    public DbSet<SavedCandidate> SavedCandidates { get; set; }
    public DbSet<SupportTicket> SupportTickets { get; set; }
    public DbSet<AdminLog> AdminLogs { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Role);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
        });

        // Candidate Configuration
        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasOne(e => e.User)
                .WithOne(u => u.Candidate)
                .HasForeignKey<Candidate>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            
            // Configure array properties
            entity.Property(e => e.Skills)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
            
            entity.Property(e => e.PreferredJobTypes)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
            
            entity.Property(e => e.PreferredLocations)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
        });

        // Company Configuration
        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasIndex(e => e.CompanyName).IsUnique();
            
            entity.HasOne(e => e.User)
                .WithOne(u => u.Company)
                .HasForeignKey<Company>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.CompanyEmail).IsRequired().HasMaxLength(255);
            
            // Configure array properties
            entity.Property(e => e.TechStack)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
        });

        // Job Configuration
        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CompanyId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Location);
            entity.HasIndex(e => e.CreatedAt);
            
            entity.HasOne(e => e.Company)
                .WithMany(c => c.Jobs)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).IsRequired();
            
            // Configure array properties
            entity.Property(e => e.Requirements)
                .HasConversion(
                    v => string.Join("|||", v),
                    v => v.Split("|||", StringSplitOptions.RemoveEmptyEntries));
            
            entity.Property(e => e.Responsibilities)
                .HasConversion(
                    v => string.Join("|||", v),
                    v => v.Split("|||", StringSplitOptions.RemoveEmptyEntries));
            
            entity.Property(e => e.RequiredSkills)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
            
            entity.Property(e => e.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
        });

        // JobApplication Configuration
        modelBuilder.Entity<JobApplication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.JobId);
            entity.HasIndex(e => e.CandidateId);
            entity.HasIndex(e => e.Status);
            
            entity.HasOne(e => e.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(e => e.JobId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(e => e.Candidate)
                .WithMany(c => c.Applications)
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // MockTest Configuration
        modelBuilder.Entity<MockTest>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.JobId);
            entity.HasIndex(e => e.CompanyId);
            
            entity.HasOne(e => e.Job)
                .WithMany(j => j.MockTests)
                .HasForeignKey(e => e.JobId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(e => e.Company)
                .WithMany(c => c.MockTests)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
        });

        // TestResult Configuration
        modelBuilder.Entity<TestResult>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.MockTestId, e.CandidateId }).IsUnique();
            
            entity.HasOne(e => e.MockTest)
                .WithMany(m => m.TestResults)
                .HasForeignKey(e => e.MockTestId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Candidate)
                .WithMany(c => c.TestResults)
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // SavedJob Configuration
        modelBuilder.Entity<SavedJob>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.CandidateId, e.JobId }).IsUnique();
            
            entity.HasOne(e => e.Candidate)
                .WithMany(c => c.SavedJobs)
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Job)
                .WithMany(j => j.SavedJobs)
                .HasForeignKey(e => e.JobId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // SavedCandidate Configuration
        modelBuilder.Entity<SavedCandidate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.CompanyId, e.CandidateId }).IsUnique();
            
            entity.HasOne(e => e.Company)
                .WithMany(c => c.SavedCandidates)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Candidate)
                .WithMany()
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // SupportTicket Configuration
        modelBuilder.Entity<SupportTicket>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TicketNumber).IsUnique();
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Status);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.SupportTickets)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.TicketNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Subject).IsRequired().HasMaxLength(500);
        });

        // AdminLog Configuration
        modelBuilder.Entity<AdminLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.AdminUserId);
            entity.HasIndex(e => e.Timestamp);
        });

        // RefreshToken Configuration
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Token).IsUnique();
            entity.HasIndex(e => e.UserId);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Token).IsRequired();
        });
    }
}
