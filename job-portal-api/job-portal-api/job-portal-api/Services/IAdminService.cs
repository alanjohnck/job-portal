using JobPortalApi.DTOs;
using JobPortalApi.Helpers;

namespace JobPortalApi.Services;

public interface IAdminService
{
    Task<ApiResponse<AdminDashboardStats>> GetDashboardStatsAsync();
    Task<ApiResponse<List<ActivityDto>>> GetRecentActivityAsync(int limit = 20);
    Task<ApiResponse<PaginationResponse<UserDto>>> GetAllUsersAsync(string? role, string? status, string? search, int page, int pageSize);
    Task<ApiResponse<object>> ToggleUserStatusAsync(Guid userId, bool isActive);
    Task<ApiResponse<object>> DeleteJobAsync(Guid jobId);
    Task<ApiResponse<PaginationResponse<SupportTicketDto>>> GetSupportTicketsAsync(string? status, string? priority, string? type, int page, int pageSize); // type is not used? in query maybe.
    Task<ApiResponse<object>> UpdateTicketStatusAsync(Guid ticketId, string status);
}
