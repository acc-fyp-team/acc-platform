using Backend.Data;
using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    // Repository layer: database access only, no business rules.
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _db;

        public EmployeeRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<Employee>> GetAllAsync(string? search, string? status)
        {
            var query = _db.Employees.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(e => e.Status == status);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(e =>
                    e.FullName.ToLower().Contains(term) ||
                    e.Phone.Contains(term) ||
                    e.Designation.ToLower().Contains(term) ||
                    (e.CNIC != null && e.CNIC.Contains(term)) ||
                    (e.City != null && e.City.ToLower().Contains(term)));
            }

            return await query.OrderBy(e => e.FullName).ToListAsync();
        }

        public Task<Employee?> GetByIdAsync(int id) =>
            _db.Employees.FirstOrDefaultAsync(e => e.EmployeeID == id);

        public Task<bool> CnicExistsAsync(string cnic, int? excludeId) =>
            _db.Employees.AnyAsync(e => e.CNIC == cnic && (excludeId == null || e.EmployeeID != excludeId));

        public async Task AddAsync(Employee employee) => await _db.Employees.AddAsync(employee);

        public void Remove(Employee employee) => _db.Employees.Remove(employee);

        public Task SaveAsync() => _db.SaveChangesAsync();
    }
}
