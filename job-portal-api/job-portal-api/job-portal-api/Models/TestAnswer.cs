namespace JobPortalApi.Models;

public class TestAnswer
{
    public Guid Id { get; set; }
    public Guid TestResultId { get; set; }          // Links to candidate's attempt
    public Guid TestQuestionId { get; set; }
    public Guid SelectedOptionId { get; set; }      // Candidate's selected option

    public bool IsCorrect { get; set; }             // Auto-calculated
    public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public TestResult TestResult { get; set; } = null!;
    public TestQuestion TestQuestion { get; set; } = null!;
    public TestQuestionOption SelectedOption { get; set; } = null!;
}
