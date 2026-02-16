using JobPortalApi.DTOs;
using JobPortalApi.Helpers;
using JobPortalApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobPortalApi.Controllers;

[ApiController]
[Route("api/v1/tests")]
[Authorize]
public class TestController : ControllerBase
{
    private readonly ITestService _testService;

    public TestController(ITestService testService)
    {
        _testService = testService;
    }

    // Company Endpoints

    [HttpPost]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> CreateTest([FromBody] CreateTestRequestDto request)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("CompanyId")?.Value ?? throw new UnauthorizedAccessException());
            var test = await _testService.CreateTestAsync(companyId, request);
            return Ok(new ApiResponse<TestDto>
            {
                Success = true,
                Message = "Test created successfully",
                Data = test
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpPost("{testId}/questions")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> AddQuestion(Guid testId, [FromBody] AddQuestionRequestDto request)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("CompanyId")?.Value ?? throw new UnauthorizedAccessException());
            var question = await _testService.AddQuestionAsync(testId, companyId, request);
            return Ok(new ApiResponse<TestQuestionDto>
            {
                Success = true,
                Message = "Question added successfully",
                Data = question
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpGet("{testId}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> GetTestById(Guid testId)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("CompanyId")?.Value ?? throw new UnauthorizedAccessException());
            var test = await _testService.GetTestByIdAsync(testId, companyId);
            return Ok(new ApiResponse<TestDetailDto>
            {
                Success = true,
                Data = test
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpGet("job/{jobId}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> GetTestsByJobId(Guid jobId)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("CompanyId")?.Value ?? throw new UnauthorizedAccessException());
            var tests = await _testService.GetTestsByJobIdAsync(jobId, companyId);
            return Ok(new ApiResponse<List<TestDto>>
            {
                Success = true,
                Data = tests
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpGet("{testId}/results")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> GetTestResults(Guid testId)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("CompanyId")?.Value ?? throw new UnauthorizedAccessException());
            var results = await _testService.GetTestResultsAsync(testId, companyId);
            return Ok(new ApiResponse<List<TestResultSummaryDto>>
            {
                Success = true,
                Data = results
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpGet("results/{resultId}/detail")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> GetTestResultDetail(Guid resultId)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("CompanyId")?.Value ?? throw new UnauthorizedAccessException());
            var result = await _testService.GetTestResultDetailAsync(resultId, companyId);
            return Ok(new ApiResponse<TestResultDetailDto>
            {
                Success = true,
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpDelete("{testId}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> DeleteTest(Guid testId)
    {
        try
        {
            var companyId = Guid.Parse(User.FindFirst("CompanyId")?.Value ?? throw new UnauthorizedAccessException());
            var success = await _testService.DeleteTestAsync(testId, companyId);
            if (!success)
                return NotFound(new ApiResponse<object> { Success = false, Message = "Test not found" });

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Test deleted successfully"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    // Candidate Endpoints

    [HttpGet("available")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> GetAvailableTests()
    {
        try
        {
            var candidateId = Guid.Parse(User.FindFirst("CandidateId")?.Value ?? throw new UnauthorizedAccessException());
            var tests = await _testService.GetAvailableTestsAsync(candidateId);
            return Ok(new ApiResponse<List<TestAttemptDto>>
            {
                Success = true,
                Data = tests
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpGet("{testId}/take")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> GetTestForCandidate(Guid testId)
    {
        try
        {
            var candidateId = Guid.Parse(User.FindFirst("CandidateId")?.Value ?? throw new UnauthorizedAccessException());
            var test = await _testService.GetTestForCandidateAsync(testId, candidateId);
            return Ok(new ApiResponse<TestDetailDto>
            {
                Success = true,
                Data = test
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpPost("{testId}/start")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> StartTest(Guid testId)
    {
        try
        {
            var candidateId = Guid.Parse(User.FindFirst("CandidateId")?.Value ?? throw new UnauthorizedAccessException());
            var result = await _testService.StartTestAsync(testId, candidateId);
            return Ok(new ApiResponse<TestResultSummaryDto>
            {
                Success = true,
                Message = "Test started successfully",
                Data = result
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpPost("{testId}/submit")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> SubmitTest(Guid testId, [FromBody] SubmitTestRequestDto request)
    {
        try
        {
            var candidateId = Guid.Parse(User.FindFirst("CandidateId")?.Value ?? throw new UnauthorizedAccessException());
            var result = await _testService.SubmitTestAsync(testId, candidateId, request);
            return Ok(new ApiResponse<TestResultDetailDto>
            {
                Success = true,
                Message = "Test submitted successfully",
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }

    [HttpGet("{testId}/my-result")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> GetMyTestResult(Guid testId)
    {
        try
        {
            var candidateId = Guid.Parse(User.FindFirst("CandidateId")?.Value ?? throw new UnauthorizedAccessException());
            var result = await _testService.GetMyTestResultAsync(testId, candidateId);
            return Ok(new ApiResponse<TestResultDetailDto>
            {
                Success = true,
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = ex.Message });
        }
    }
}
