using Backend.Models.DTOs;

namespace Backend.Services
{
    // The outcome of a sign-in attempt: whether it worked, which HTTP status to
    // return, the message if it failed, and the data if it succeeded.
    public record AuthResult(bool Success, int StatusCode, string? Error, AuthResponseDto? Data);

    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(LoginDto dto);
    }
}
