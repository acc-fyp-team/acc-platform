using Backend.Auth;
using Backend.Models.DTOs;
using Backend.Repositories;

namespace Backend.Services
{
    // Service layer: all the sign-in rules live here.
    public class AuthService : IAuthService
    {
        // How long a token stays valid.
        private static readonly TimeSpan NormalSession = TimeSpan.FromHours(12);
        private static readonly TimeSpan KeepSignedInSession = TimeSpan.FromDays(30);

        private readonly IUserRepository _users;
        private readonly TokenService _tokens;

        public AuthService(IUserRepository users, TokenService tokens)
        {
            _users = users;
            _tokens = tokens;
        }

        public async Task<AuthResult> LoginAsync(LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return new AuthResult(false, 400, "Enter your username and password.", null);

            var user = await _users.GetByUsernameAsync(dto.Username.Trim());

            // The same message is returned for an unknown username and a wrong
            // password, so nobody can use this endpoint to discover which
            // usernames exist.
            if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return new AuthResult(false, 401, "Invalid username or password.", null);

            if (!user.IsActive)
                return new AuthResult(false, 403, "This account is inactive.", null);

            var expiresUtc = DateTime.UtcNow.Add(dto.KeepSignedIn ? KeepSignedInSession : NormalSession);
            var token = _tokens.CreateToken(user, expiresUtc);

            await _users.UpdateLastLoginAsync(user);

            return new AuthResult(true, 200, null, new AuthResponseDto
            {
                Token = token,
                UserID = user.UserID,
                Username = user.Username,
                FullName = user.FullName,
                Role = user.Role,
                ProfilePicture = user.ProfilePicture
            });
        }
    }
}
