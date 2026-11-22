using Backend.Auth;
using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Repositories;

namespace Backend.Services
{
    // Service layer: the rules of the Control Unit.
    public class PermissionService : IPermissionService
    {
        private readonly IPermissionRepository _permissions;
        private readonly IUserRepository _users;

        public PermissionService(IPermissionRepository permissions, IUserRepository users)
        {
            _permissions = permissions;
            _users = users;
        }

        public async Task<List<PermissionDto>> GetUserPermissionsAsync(int userId)
        {
            var user = await _users.GetByIdAsync(userId);

            // An Admin is allowed everything and has no rows stored, so the full
            // list is built here. Clients use this to decide which screens to show.
            if (user is not null && string.Equals(user.Role, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                return (from module in PermissionCatalog.Modules
                        from action in PermissionCatalog.Actions
                        select new PermissionDto
                        {
                            Module = module,
                            Action = action,
                            IsAllowed = true,
                            RequiresApproval = false
                        }).ToList();
            }

            var rows = await _permissions.GetByUserAsync(userId);

            return rows.Select(p => new PermissionDto
            {
                Module = p.Module,
                Action = p.Action,
                IsAllowed = p.IsAllowed,
                RequiresApproval = p.RequiresApproval
            }).ToList();
        }

        public async Task<bool> HasPermissionAsync(int userId, string module, string action)
        {
            var row = await _permissions.FindAsync(userId, module, action);
            return row is not null && row.IsAllowed;
        }

        public async Task SetPermissionAsync(SetPermissionDto dto)
        {
            var existing = await _permissions.FindAsync(dto.UserID, dto.Module, dto.Action);

            if (existing is null)
            {
                await _permissions.AddAsync(new UserPermission
                {
                    UserID = dto.UserID,
                    Module = dto.Module,
                    Action = dto.Action,
                    IsAllowed = dto.IsAllowed,
                    RequiresApproval = dto.RequiresApproval,
                    UpdatedAt = DateTime.UtcNow
                });
            }
            else
            {
                existing.IsAllowed = dto.IsAllowed;
                existing.RequiresApproval = dto.RequiresApproval;
                existing.UpdatedAt = DateTime.UtcNow;
            }

            await _permissions.SaveAsync();
        }
    }
}
