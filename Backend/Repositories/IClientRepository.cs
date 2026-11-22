using Backend.Models.Entities;

namespace Backend.Repositories
{
    public interface IClientRepository
    {
        Task<List<Client>> GetAllAsync(string? search, string? status);
        Task<Client?> GetByIdAsync(int id);

        // Is this CNIC already used by another client?
        // excludeId is the client being edited, so it doesn't clash with itself.
        Task<bool> CnicExistsAsync(string cnic, int? excludeId);

        Task AddAsync(Client client);
        void Remove(Client client);
        Task SaveAsync();
    }
}
