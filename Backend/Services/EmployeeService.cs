using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Repositories;

namespace Backend.Services
{
    // Service layer: all the employee rules live here.
    public class EmployeeService : IEmployeeService
    {
        private static readonly string[] AllowedStatuses = { "Active", "Inactive" };

        private readonly IEmployeeRepository _employees;

        public EmployeeService(IEmployeeRepository employees)
        {
            _employees = employees;
        }

        public async Task<List<EmployeeDto>> GetAllAsync(string? search, string? status) =>
            (await _employees.GetAllAsync(search, status)).Select(ToDto).ToList();

        public async Task<EmployeeDto?> GetByIdAsync(int id)
        {
            var employee = await _employees.GetByIdAsync(id);
            return employee is null ? null : ToDto(employee);
        }

        public async Task<EmployeeResult> CreateAsync(CreateEmployeeDto dto)
        {
            var error = await ValidateAsync(dto, null);
            if (error is not null)
                return new EmployeeResult(false, 400, error, null);

            var employee = new Employee
            {
                FullName = dto.FullName.Trim(),
                Phone = dto.Phone.Trim(),
                SecondaryPhone = dto.SecondaryPhone?.Trim(),
                CNIC = string.IsNullOrWhiteSpace(dto.CNIC) ? null : dto.CNIC.Trim(),
                Email = dto.Email?.Trim(),
                Address = dto.Address?.Trim(),
                City = dto.City?.Trim(),
                Designation = dto.Designation.Trim(),
                JoiningDate = dto.JoiningDate,
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _employees.AddAsync(employee);
            await _employees.SaveAsync();

            return new EmployeeResult(true, 201, null, ToDto(employee));
        }

        public async Task<EmployeeResult> UpdateAsync(int id, CreateEmployeeDto dto)
        {
            var employee = await _employees.GetByIdAsync(id);
            if (employee is null)
                return new EmployeeResult(false, 404, "Employee not found.", null);

            var error = await ValidateAsync(dto, id);
            if (error is not null)
                return new EmployeeResult(false, 400, error, null);

            employee.FullName = dto.FullName.Trim();
            employee.Phone = dto.Phone.Trim();
            employee.SecondaryPhone = dto.SecondaryPhone?.Trim();
            employee.CNIC = string.IsNullOrWhiteSpace(dto.CNIC) ? null : dto.CNIC.Trim();
            employee.Email = dto.Email?.Trim();
            employee.Address = dto.Address?.Trim();
            employee.City = dto.City?.Trim();
            employee.Designation = dto.Designation.Trim();
            employee.JoiningDate = dto.JoiningDate;
            employee.Status = dto.Status;
            employee.UpdatedAt = DateTime.UtcNow;

            await _employees.SaveAsync();

            return new EmployeeResult(true, 200, null, ToDto(employee));
        }

        public async Task<EmployeeResult> DeleteAsync(int id)
        {
            var employee = await _employees.GetByIdAsync(id);
            if (employee is null)
                return new EmployeeResult(false, 404, "Employee not found.", null);

            _employees.Remove(employee);
            await _employees.SaveAsync();

            return new EmployeeResult(true, 200, null, null);
        }

        // Shared checks for create and update.
        private async Task<string?> ValidateAsync(CreateEmployeeDto dto, int? excludeId)
        {
            if (!AllowedStatuses.Contains(dto.Status))
                return "Status must be Active or Inactive.";

            // CNIC is optional, but when given it must not belong to someone else.
            if (!string.IsNullOrWhiteSpace(dto.CNIC) &&
                await _employees.CnicExistsAsync(dto.CNIC.Trim(), excludeId))
                return "An employee with this CNIC already exists.";

            return null;
        }

        private static EmployeeDto ToDto(Employee e) => new()
        {
            EmployeeID = e.EmployeeID,
            FullName = e.FullName,
            Phone = e.Phone,
            SecondaryPhone = e.SecondaryPhone,
            CNIC = e.CNIC,
            Email = e.Email,
            Address = e.Address,
            City = e.City,
            Designation = e.Designation,
            JoiningDate = e.JoiningDate,
            Status = e.Status,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        };
    }
}
