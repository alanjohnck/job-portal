namespace JobPortalApi.Models;

public class TestQuestion
{
    public Guid Id { get; set; }
    public Guid MockTestId { get; set; }

    public string QuestionText { get; set; } = string.Empty;
    public int OrderNumber { get; set; }            // Question sequence
    public int Points { get; set; } = 1;            // Points for correct answer

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public MockTest MockTest { get; set; } = null!;
    public ICollection<TestQuestionOption> Options { get; set; } = new List<TestQuestionOption>();
    public ICollection<TestAnswer> Answers { get; set; } = new List<TestAnswer>();
}
