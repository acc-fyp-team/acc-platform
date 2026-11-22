using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Backend.Auth
{
    // Admin-only endpoints (eg user management, Control Unit).
    // These areas are never handed to other users through permissions.
    public class AdminOnlyAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var role = context.HttpContext.User.FindFirst(ClaimTypes.Role)?.Value
                       ?? context.HttpContext.User.FindFirst("role")?.Value;

            if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                context.Result = new ObjectResult(new { message = "This area is restricted to administrators." })
                {
                    StatusCode = 403
                };
            }
        }
    }
}
