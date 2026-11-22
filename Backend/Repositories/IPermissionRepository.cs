using Backend.Models.Entities;

namespace Backend.Repositories
{
    public interface IPermissionRepository
    {
        Task<List<UserPermission>> GetByUserAsync(int userId);
        Task<UserPermission?> FindAsync(int userId, string module, string action);
        Task AddAsync(UserPermission permission);
        Task SaveAsync();
    }
}
