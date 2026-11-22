using System.Security.Claims;
using Backend.Auth;
using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    // User permissions (Control Unit). Base route: /api/permissions
    // [Authorize] means a valid token is required for everything here.
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PermissionsController : ControllerBase
    {
        private readonly IPermissionService _service;

        public PermissionsController(IPermissionService service)
        {
            _service = service;
        }

        // GET: /api/permissions/user/5
        // Users may read their own permissions (their menu needs them).
        // Admins may read anyone's.
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetForUser(int userId)
        {
            if (!IsAdmin() && userId != CurrentUserId())
                return StatusCode(403, new { message = "You can only view your own permissions." });

            return Ok(await _service.GetUserPermissionsAsync(userId));
        }

        // GET: /api/permissions/me  = a shortcut for "my own permissions"
        [HttpGet("me")]
        public async Task<IActionResult> GetMine() =>
            Ok(await _service.GetUserPermissionsAsync(CurrentUserId()));

        // PUT: /api/permissions  = grant or remove one permission (Admin only)
        [HttpPut]
        [AdminOnly]
        public async Task<IActionResult> Set([FromBody] SetPermissionDto dto)
        {
            if (!PermissionCatalog.Modules.Contains(dto.Module))
                return BadRequest(new { message = "Unknown module.", field = "module" });

            if (!PermissionCatalog.Actions.Contains(dto.Action))
                return BadRequest(new { message = "Unknown action.", field = "action" });

            await _service.SetPermissionAsync(dto);
            return Ok(new { message = "Permission updated." });
        }

        private int CurrentUserId() =>
            int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : 0;

        private bool IsAdmin() =>
            string.Equals(User.FindFirst(ClaimTypes.Role)?.Value, "Admin", StringComparison.OrdinalIgnoreCase);
    }
}
