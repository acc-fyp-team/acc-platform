using Backend.Auth;
using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    // Employees. Base route: /api/employees
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _service;

        public EmployeesController(IEmployeeService service)
        {
            _service = service;
        }

        // GET: /api/employees?search=mason&status=Active
        [HttpGet]
        [RequirePermission("Employees", "View")]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? status) =>
            Ok(await _service.GetAllAsync(search, status));

        // GET: /api/employees/5
        [HttpGet("{id}")]
        [RequirePermission("Employees", "View")]
        public async Task<IActionResult> GetById(int id)
        {
            var employee = await _service.GetByIdAsync(id);
            if (employee is null)
                return NotFound(new { message = "Employee not found." });

            return Ok(employee);
        }

        // POST: /api/employees
        [HttpPost]
        [RequirePermission("Employees", "Add")]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
        {
            var result = await _service.CreateAsync(dto);
            if (!result.Success)
                return StatusCode(result.StatusCode, new { message = result.Error });

            return CreatedAtAction(nameof(GetById), new { id = result.Data!.EmployeeID }, result.Data);
        }

        // PUT: /api/employees/5
        [HttpPut("{id}")]
        [RequirePermission("Employees", "Edit")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateEmployeeDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (!result.Success)
                return StatusCode(result.StatusCode, new { message = result.Error });

            return Ok(result.Data);
        }

        // DELETE: /api/employees/5
        [HttpDelete("{id}")]
        [RequirePermission("Employees", "Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result.Success)
                return StatusCode(result.StatusCode, new { message = result.Error });

            return Ok(new { message = "Employee deleted." });
        }
    }
}
