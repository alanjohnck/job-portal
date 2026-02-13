namespace JobPortalApi.Models;

public class TestQuestionOption
{
    public Guid Id { get; set; }
    public Guid TestQuestionId { get; set; }

    public string OptionText { get; set; } = string.Empty;
    public int OrderNumber { get; set; }            // Option sequence (A, B, C, D)
    public bool IsCorrect { get; set; }             // Mark correct answer

    // Navigation Properties
    public TestQuestion TestQuestion { get; set; } = null!;
}
