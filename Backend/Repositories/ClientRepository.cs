using Backend.Data;
using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    // Repository layer: database access only, no business rules.
    public class ClientRepository : IClientRepository
    {
        private readonly AppDbContext _db;

        public ClientRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<Client>> GetAllAsync(string? search, string? status)
        {
            var query = _db.Clients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(c => c.Status == status);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(c =>
                    c.FullName.ToLower().Contains(term) ||
                    c.Phone.Contains(term) ||
                    c.CNIC.Contains(term) ||
                    (c.City != null && c.City.ToLower().Contains(term)));
            }

            return await query.OrderBy(c => c.FullName).ToListAsync();
        }

        public Task<Client?> GetByIdAsync(int id) =>
            _db.Clients.FirstOrDefaultAsync(c => c.ClientID == id);

        public Task<bool> CnicExistsAsync(string cnic, int? excludeId) =>
            _db.Clients.AnyAsync(c => c.CNIC == cnic && (excludeId == null || c.ClientID != excludeId));

        public async Task AddAsync(Client client) => await _db.Clients.AddAsync(client);

        public void Remove(Client client) => _db.Clients.Remove(client);

        public Task SaveAsync() => _db.SaveChangesAsync();
    }
}
