using Backend.Data;
using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    // Repository layer: database access only.
    public class PermissionRepository : IPermissionRepository
    {
        private readonly AppDbContext _db;

        public PermissionRepository(AppDbContext db)
        {
            _db = db;
        }

        public Task<List<UserPermission>> GetByUserAsync(int userId) =>
            _db.UserPermissions
               .Where(p => p.UserID == userId)
               .OrderBy(p => p.Module).ThenBy(p => p.Action)
               .ToListAsync();

        public Task<UserPermission?> FindAsync(int userId, string module, string action) =>
            _db.UserPermissions.FirstOrDefaultAsync(p =>
                p.UserID == userId && p.Module == module && p.Action == action);

        public async Task AddAsync(UserPermission permission) =>
            await _db.UserPermissions.AddAsync(permission);

        public Task SaveAsync() => _db.SaveChangesAsync();
    }
}
