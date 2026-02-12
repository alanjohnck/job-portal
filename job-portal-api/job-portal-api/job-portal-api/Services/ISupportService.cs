using JobPortalApi.DTOs;
using JobPortalApi.Helpers;

namespace JobPortalApi.Services;

public interface ISupportService
{
    Task<ApiResponse<SupportTicketDto>> CreateTicketAsync(Guid userId, CreateSupportTicketRequest request);
    Task<ApiResponse<List<SupportTicketDto>>> GetMyTicketsAsync(Guid userId, string? status);
}
