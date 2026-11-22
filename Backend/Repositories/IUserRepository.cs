using Backend.Models.Entities;

namespace Backend.Repositories
{
    // The database operations the rest of the app needs for users.
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByIdAsync(int userId);
        Task UpdateLastLoginAsync(User user);
    }
}
