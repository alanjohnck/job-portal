using Microsoft.EntityFrameworkCore;
using JobPortalApi.Data;
using JobPortalApi.DTOs;
using JobPortalApi.Helpers;
using JobPortalApi.Models;

namespace JobPortalApi.Services;

public class CandidateService : ICandidateService
{
    private readonly JobPortalDbContext _context;

    public CandidateService(JobPortalDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<CandidateProfileDto>> GetProfileAsync(Guid userId)
    {
        var candidate = await _context.Candidates
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (candidate == null)
            return ApiResponse<CandidateProfileDto>.ErrorResponse("Candidate profile not found", "NOT_FOUND");

        var profileDto = new CandidateProfileDto
        {
            Id = candidate.Id,
            UserId = candidate.UserId,
            FirstName = candidate.FirstName,
            LastName = candidate.LastName,
            Email = candidate.User.Email,
            PhoneNumber = candidate.PhoneNumber,
            DateOfBirth = candidate.DateOfBirth,
            Gender = candidate.Gender,
            CurrentLocation = candidate.CurrentLocation,
            ProfilePicture = candidate.ProfilePicture,
            CurrentJobTitle = candidate.CurrentJobTitle,
            Education = candidate.Education,
            ExperienceYears = candidate.ExperienceYears,
            Skills = candidate.Skills,
            ResumeUrl = candidate.ResumeUrl,
            Bio = candidate.Bio,
            LinkedInUrl = candidate.LinkedInUrl,
            GithubUrl = candidate.GithubUrl,
            PortfolioUrl = candidate.PortfolioUrl,
            TwitterUrl = candidate.TwitterUrl,
            PreferredJobTypes = candidate.PreferredJobTypes,
            ExpectedSalary = candidate.ExpectedSalary,
            PreferredLocations = candidate.PreferredLocations,
            CreatedAt = candidate.CreatedAt,
            UpdatedAt = candidate.UpdatedAt
        };

        return ApiResponse<CandidateProfileDto>.SuccessResponse(profileDto);
    }

    public async Task<ApiResponse<CandidateProfileDto>> UpdateProfileAsync(Guid userId, UpdateCandidateProfileRequest request)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<CandidateProfileDto>.ErrorResponse("Candidate profile not found", "NOT_FOUND");

        candidate.FirstName = request.FirstName ?? candidate.FirstName;
        candidate.LastName = request.LastName ?? candidate.LastName;
        candidate.PhoneNumber = request.PhoneNumber ?? candidate.PhoneNumber;
        candidate.DateOfBirth = request.DateOfBirth ?? candidate.DateOfBirth;
        candidate.Gender = request.Gender ?? candidate.Gender;
        candidate.CurrentLocation = request.CurrentLocation ?? candidate.CurrentLocation;
        candidate.CurrentJobTitle = request.CurrentJobTitle ?? candidate.CurrentJobTitle;
        candidate.Education = request.Education ?? candidate.Education;
        candidate.ExperienceYears = request.ExperienceYears ?? candidate.ExperienceYears;
        candidate.Skills = request.Skills.Length > 0 ? request.Skills : candidate.Skills;
        candidate.Bio = request.Bio ?? candidate.Bio;
        candidate.LinkedInUrl = request.LinkedInUrl ?? candidate.LinkedInUrl;
        candidate.GithubUrl = request.GithubUrl ?? candidate.GithubUrl;
        candidate.PortfolioUrl = request.PortfolioUrl ?? candidate.PortfolioUrl;
        candidate.TwitterUrl = request.TwitterUrl ?? candidate.TwitterUrl;
        candidate.PreferredJobTypes = request.PreferredJobTypes.Length > 0 ? request.PreferredJobTypes : candidate.PreferredJobTypes;
        candidate.ExpectedSalary = request.ExpectedSalary ?? candidate.ExpectedSalary;
        candidate.PreferredLocations = request.PreferredLocations.Length > 0 ? request.PreferredLocations : candidate.PreferredLocations;
        candidate.UpdatedAt = DateTime.UtcNow;

        _context.Candidates.Update(candidate);
        await _context.SaveChangesAsync();

        return await GetProfileAsync(userId);
    }

    public async Task<ApiResponse<PaginationResponse<JobDto>>> SearchJobsAsync(string? keyword, string? location, string? jobType, string? experienceLevel, decimal? minSalary, decimal? maxSalary, string? category, bool? isRemote, int page, int pageSize)
    {
        var query = _context.Jobs
            .Include(j => j.Company)
            .Include(j => j.Applications)
            .Include(j => j.SavedJobs)
            .Where(j => j.Status == "Active");

        if (!string.IsNullOrEmpty(keyword))
        {
            query = query.Where(j => j.Title.Contains(keyword) || j.Description.Contains(keyword) || j.Category.Contains(keyword));
        }

        if (!string.IsNullOrEmpty(location))
        {
            query = query.Where(j => j.Location.Contains(location) || j.City.Contains(location) || j.State.Contains(location));
        }

        if (!string.IsNullOrEmpty(jobType))
        {
            query = query.Where(j => j.JobType == jobType);
        }

        if (!string.IsNullOrEmpty(experienceLevel))
        {
            query = query.Where(j => j.ExperienceLevel == experienceLevel);
        }

        if (minSalary.HasValue)
        {
            query = query.Where(j => j.MinSalary >= minSalary.Value);
        }

        if (maxSalary.HasValue)
        {
            query = query.Where(j => j.MaxSalary <= maxSalary.Value);
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(j => j.Category == category);
        }

        if (isRemote.HasValue && isRemote.Value)
        {
            query = query.Where(j => j.IsRemote);
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var jobs = await query
            .OrderByDescending(j => j.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var jobDtos = jobs.Select(j => new JobDto
        {
            Id = j.Id,
            Title = j.Title,
            Description = j.Description,
            Requirements = j.Requirements,
            Responsibilities = j.Responsibilities,
            JobType = j.JobType,
            ExperienceLevel = j.ExperienceLevel,
            MinSalary = j.MinSalary,
            MaxSalary = j.MaxSalary,
            SalaryCurrency = j.SalaryCurrency,
            SalaryPeriod = j.SalaryPeriod,
            Location = j.Location,
            City = j.City,
            State = j.State,
            Country = j.Country,
            IsRemote = j.IsRemote,
            RequiredSkills = j.RequiredSkills,
            Tags = j.Tags,
            Category = j.Category,
            Status = j.Status,
            Deadline = j.Deadline,
            Openings = j.Openings,
            Education = j.Education,
            Experience = j.Experience,
            CreatedAt = j.CreatedAt,
            ApplicationsCount = j.Applications.Count,
            Company = new CompanyBasicInfo
            {
                Id = j.Company.Id,
                Name = j.Company.CompanyName,
                Logo = j.Company.Logo,
                Industry = j.Company.Industry,
                CompanySize = j.Company.CompanySize,
                Website = j.Company.Website
            }
        }).ToList();

        return ApiResponse<PaginationResponse<JobDto>>.SuccessResponse(new PaginationResponse<JobDto>
        {
            Items = jobDtos,
            Pagination = new PaginationMetadata
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalItems = totalItems,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            }
        });
    }

    public async Task<ApiResponse<JobDto>> GetJobDetailsAsync(Guid jobId, Guid userId)
    {
        var job = await _context.Jobs
            .Include(j => j.Company)
            .Include(j => j.Applications)
            .Include(j => j.SavedJobs)
            .FirstOrDefaultAsync(j => j.Id == jobId);

        if (job == null)
            return ApiResponse<JobDto>.ErrorResponse("Job not found", "NOT_FOUND");

        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        var hasApplied = candidate != null && job.Applications.Any(a => a.CandidateId == candidate.Id);
        var isSaved = candidate != null && job.SavedJobs.Any(s => s.CandidateId == candidate.Id);

        var jobDto = new JobDto
        {
            Id = job.Id,
            Title = job.Title,
            Description = job.Description,
            Requirements = job.Requirements,
            Responsibilities = job.Responsibilities,
            JobType = job.JobType,
            ExperienceLevel = job.ExperienceLevel,
            MinSalary = job.MinSalary,
            MaxSalary = job.MaxSalary,
            SalaryCurrency = job.SalaryCurrency,
            SalaryPeriod = job.SalaryPeriod,
            Location = job.Location,
            City = job.City,
            State = job.State,
            Country = job.Country,
            IsRemote = job.IsRemote,
            RequiredSkills = job.RequiredSkills,
            Tags = job.Tags,
            Category = job.Category,
            Status = job.Status,
            Deadline = job.Deadline,
            Openings = job.Openings,
            Education = job.Education,
            Experience = job.Experience,
            CreatedAt = job.CreatedAt,
            ApplicationsCount = job.Applications.Count,
            HasApplied = hasApplied,
            IsSaved = isSaved,
            Company = new CompanyBasicInfo
            {
                Id = job.Company.Id,
                Name = job.Company.CompanyName,
                Logo = job.Company.Logo,
                Industry = job.Company.Industry,
                CompanySize = job.Company.CompanySize,
                Website = job.Company.Website
            }
        };

        return ApiResponse<JobDto>.SuccessResponse(jobDto);
    }

    public async Task<ApiResponse<object>> ApplyForJobAsync(Guid userId, Guid jobId, ApplyForJobRequest request)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<object>.ErrorResponse("Candidate profile not found", "NOT_FOUND");

        var job = await _context.Jobs.FindAsync(jobId);
        if (job == null)
            return ApiResponse<object>.ErrorResponse("Job not found", "NOT_FOUND");

        // Check if already applied
        if (await _context.JobApplications.AnyAsync(a => a.CandidateId == candidate.Id && a.JobId == jobId))
            return ApiResponse<object>.ErrorResponse("You have already applied for this job", "DUPLICATE_ENTRY");

        var application = new JobApplication
        {
            Id = Guid.NewGuid(),
            JobId = jobId,
            CandidateId = candidate.Id,
            CoverLetter = request.CoverLetter,
            ResumeUrl = request.ResumeUrl ?? candidate.ResumeUrl, // Use override or default resume
            Status = "Applied",
            AppliedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.JobApplications.Add(application);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(new { ApplicationId = application.Id }, "Application submitted successfully.");
    }

    public async Task<ApiResponse<PaginationResponse<JobApplicationDto>>> GetMyApplicationsAsync(Guid userId, string? status, int page, int pageSize)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<PaginationResponse<JobApplicationDto>>.ErrorResponse("Candidate profile not found", "NOT_FOUND");

        var query = _context.JobApplications
            .Include(a => a.Job)
            .ThenInclude(j => j.Company)
            .Where(a => a.CandidateId == candidate.Id);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(a => a.Status == status);
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var applications = await query
            .OrderByDescending(a => a.AppliedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = applications.Select(a => new JobApplicationDto
        {
            Id = a.Id,
            Status = a.Status,
            AppliedAt = a.AppliedAt,
            UpdatedAt = a.UpdatedAt,
            Job = new JobBasicInfo
            {
                Id = a.Job.Id,
                Title = a.Job.Title,
                Company = new CompanyBasicInfo
                {
                    Id = a.Job.Company.Id,
                    Name = a.Job.Company.CompanyName,
                    Logo = a.Job.Company.Logo
                }
            }
        }).ToList();

        return ApiResponse<PaginationResponse<JobApplicationDto>>.SuccessResponse(new PaginationResponse<JobApplicationDto>
        {
            Items = dtos,
            Pagination = new PaginationMetadata
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalItems = totalItems,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            }
        });
    }

    public async Task<ApiResponse<object>> SaveJobAsync(Guid userId, Guid jobId)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<object>.ErrorResponse("Candidate profile not found", "NOT_FOUND");

        var job = await _context.Jobs.FindAsync(jobId);
        if (job == null)
            return ApiResponse<object>.ErrorResponse("Job not found", "NOT_FOUND");

        // Check if already saved
        if (await _context.SavedJobs.AnyAsync(s => s.CandidateId == candidate.Id && s.JobId == jobId))
            return ApiResponse<object>.ErrorResponse("Job already saved", "DUPLICATE_ENTRY");

        var savedJob = new SavedJob
        {
            Id = Guid.NewGuid(),
            CandidateId = candidate.Id,
            JobId = jobId,
            SavedAt = DateTime.UtcNow
        };

        _context.SavedJobs.Add(savedJob);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Job saved successfully.");
    }

    public async Task<ApiResponse<object>> UnsaveJobAsync(Guid userId, Guid jobId)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<object>.ErrorResponse("Candidate profile not found", "NOT_FOUND");

        var savedJob = await _context.SavedJobs.FirstOrDefaultAsync(s => s.CandidateId == candidate.Id && s.JobId == jobId);
        if (savedJob == null)
            return ApiResponse<object>.ErrorResponse("Saved job not found", "NOT_FOUND");

        _context.SavedJobs.Remove(savedJob);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Job removed from saved list.");
    }

    public async Task<ApiResponse<List<JobDto>>> GetSavedJobsAsync(Guid userId)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<List<JobDto>>.ErrorResponse("Candidate profile not found", "NOT_FOUND");

        var savedJobs = await _context.SavedJobs
            .Include(s => s.Job)
            .ThenInclude(j => j.Company)
            .Where(s => s.CandidateId == candidate.Id)
            .OrderByDescending(s => s.SavedAt)
            .Select(s => s.Job)
            .ToListAsync();

        var jobDtos = savedJobs.Select(j => new JobDto
        {
            Id = j.Id,
            Title = j.Title,
            Description = j.Description,
            Company = new CompanyBasicInfo
            {
                Id = j.Company.Id,
                Name = j.Company.CompanyName,
                Logo = j.Company.Logo
            },
            Location = j.Location,
            JobType = j.JobType,
            MinSalary = j.MinSalary,
            MaxSalary = j.MaxSalary,
            SalaryCurrency = j.SalaryCurrency,
            SalaryPeriod = j.SalaryPeriod,
            Education = j.Education,
            Experience = j.Experience,
            CreatedAt = j.CreatedAt,
            IsSaved = true
        }).ToList();

        return ApiResponse<List<JobDto>>.SuccessResponse(jobDtos);
    }
}
