using Backend.Data;
using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    // Repository layer: talks to the database only.
    // No business rules live here - those belong in the Service layer.
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;

        public UserRepository(AppDbContext db)
        {
            _db = db;
        }

        public Task<User?> GetByUsernameAsync(string username) =>
            _db.Users.FirstOrDefaultAsync(u => u.Username == username);

        public async Task UpdateLastLoginAsync(User user)
        {
            user.LastLogin = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }
}
