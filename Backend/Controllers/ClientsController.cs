using Backend.Auth;
using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    // Clients. Base route: /api/clients
    // [Authorize] = a valid token is required.
    // [RequirePermission] = that token's user must also be allowed this action.
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _service;

        public ClientsController(IClientService service)
        {
            _service = service;
        }

        // GET: /api/clients?search=ali&status=Active
        [HttpGet]
        [RequirePermission("Clients", "View")]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? status) =>
            Ok(await _service.GetAllAsync(search, status));

        // GET: /api/clients/5
        [HttpGet("{id}")]
        [RequirePermission("Clients", "View")]
        public async Task<IActionResult> GetById(int id)
        {
            var client = await _service.GetByIdAsync(id);
            if (client is null)
                return NotFound(new { message = "Client not found." });

            return Ok(client);
        }

        // POST: /api/clients
        [HttpPost]
        [RequirePermission("Clients", "Add")]
        public async Task<IActionResult> Create([FromBody] ClientDto dto)
        {
            var result = await _service.CreateAsync(dto);
            if (!result.Success)
                return StatusCode(result.StatusCode, new { message = result.Error });

            return CreatedAtAction(nameof(GetById), new { id = result.Data!.ClientID }, result.Data);
        }

        // PUT: /api/clients/5
        [HttpPut("{id}")]
        [RequirePermission("Clients", "Edit")]
        public async Task<IActionResult> Update(int id, [FromBody] ClientDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (!result.Success)
                return StatusCode(result.StatusCode, new { message = result.Error });

            return Ok(result.Data);
        }

        // DELETE: /api/clients/5
        [HttpDelete("{id}")]
        [RequirePermission("Clients", "Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result.Success)
                return StatusCode(result.StatusCode, new { message = result.Error });

            return Ok(new { message = "Client deleted." });
        }
    }
}
