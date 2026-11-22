using Backend.Models.DTOs;

namespace Backend.Services
{
    // The outcome of a client operation: whether it worked, which HTTP status to
    // return, the message if it failed, and the data if it succeeded.
    public record ClientResult(bool Success, int StatusCode, string? Error, ClientResponseDto? Data);

    public interface IClientService
    {
        Task<List<ClientResponseDto>> GetAllAsync(string? search, string? status);
        Task<ClientResponseDto?> GetByIdAsync(int id);
        Task<ClientResult> CreateAsync(ClientDto dto);
        Task<ClientResult> UpdateAsync(int id, ClientDto dto);
        Task<ClientResult> DeleteAsync(int id);
    }
}
