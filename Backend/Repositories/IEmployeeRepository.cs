using Backend.Models.Entities;

namespace Backend.Repositories
{
    public interface IEmployeeRepository
    {
        Task<List<Employee>> GetAllAsync(string? search, string? status);
        Task<Employee?> GetByIdAsync(int id);

        // Is this CNIC already used by another employee?
        // excludeId is the employee being edited, so it doesn't clash with itself.
        Task<bool> CnicExistsAsync(string cnic, int? excludeId);

        Task AddAsync(Employee employee);
        void Remove(Employee employee);
        Task SaveAsync();
    }
}
