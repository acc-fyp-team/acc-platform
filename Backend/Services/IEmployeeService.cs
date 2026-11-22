using Backend.Models.DTOs;

namespace Backend.Services
{
    // The outcome of an employee operation: whether it worked, which HTTP status
    // to return, the message if it failed, and the data if it succeeded.
    public record EmployeeResult(bool Success, int StatusCode, string? Error, EmployeeDto? Data);

    public interface IEmployeeService
    {
        Task<List<EmployeeDto>> GetAllAsync(string? search, string? status);
        Task<EmployeeDto?> GetByIdAsync(int id);
        Task<EmployeeResult> CreateAsync(CreateEmployeeDto dto);
        Task<EmployeeResult> UpdateAsync(int id, CreateEmployeeDto dto);
        Task<EmployeeResult> DeleteAsync(int id);
    }
}
