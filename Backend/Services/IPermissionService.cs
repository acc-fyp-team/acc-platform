using Backend.Models.DTOs;

namespace Backend.Services
{
    public interface IPermissionService
    {
        // Everything this user may do. For an Admin the full list is returned.
        Task<List<PermissionDto>> GetUserPermissionsAsync(int userId);

        // Used by [RequirePermission] to guard an endpoint.
        Task<bool> HasPermissionAsync(int userId, string module, string action);

        // Admin grants or removes one permission.
        Task SetPermissionAsync(SetPermissionDto dto);
    }
}
