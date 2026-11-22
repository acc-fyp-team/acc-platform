using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Repositories;

namespace Backend.Services
{
    // Service layer: all the client rules live here.
    public class ClientService : IClientService
    {
        private static readonly string[] AllowedTypes = { "External", "Internal" };
        private static readonly string[] AllowedStatuses = { "Active", "Inactive" };

        private readonly IClientRepository _clients;

        public ClientService(IClientRepository clients)
        {
            _clients = clients;
        }

        public async Task<List<ClientResponseDto>> GetAllAsync(string? search, string? status) =>
            (await _clients.GetAllAsync(search, status)).Select(ToDto).ToList();

        public async Task<ClientResponseDto?> GetByIdAsync(int id)
        {
            var client = await _clients.GetByIdAsync(id);
            return client is null ? null : ToDto(client);
        }

        public async Task<ClientResult> CreateAsync(ClientDto dto)
        {
            var error = await ValidateAsync(dto, null);
            if (error is not null)
                return new ClientResult(false, 400, error, null);

            var client = new Client
            {
                FullName = dto.FullName.Trim(),
                Email = dto.Email?.Trim(),
                Phone = dto.Phone.Trim(),
                SecondaryPhone = dto.SecondaryPhone?.Trim(),
                CNIC = dto.CNIC.Trim(),
                Address = dto.Address?.Trim(),
                City = dto.City?.Trim(),
                ClientType = dto.ClientType,
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _clients.AddAsync(client);
            await _clients.SaveAsync();

            return new ClientResult(true, 201, null, ToDto(client));
        }

        public async Task<ClientResult> UpdateAsync(int id, ClientDto dto)
        {
            var client = await _clients.GetByIdAsync(id);
            if (client is null)
                return new ClientResult(false, 404, "Client not found.", null);

            var error = await ValidateAsync(dto, id);
            if (error is not null)
                return new ClientResult(false, 400, error, null);

            client.FullName = dto.FullName.Trim();
            client.Email = dto.Email?.Trim();
            client.Phone = dto.Phone.Trim();
            client.SecondaryPhone = dto.SecondaryPhone?.Trim();
            client.CNIC = dto.CNIC.Trim();
            client.Address = dto.Address?.Trim();
            client.City = dto.City?.Trim();
            client.ClientType = dto.ClientType;
            client.Status = dto.Status;
            client.UpdatedAt = DateTime.UtcNow;

            await _clients.SaveAsync();

            return new ClientResult(true, 200, null, ToDto(client));
        }

        public async Task<ClientResult> DeleteAsync(int id)
        {
            var client = await _clients.GetByIdAsync(id);
            if (client is null)
                return new ClientResult(false, 404, "Client not found.", null);

            _clients.Remove(client);
            await _clients.SaveAsync();

            return new ClientResult(true, 200, null, null);
        }

        // Shared checks for create and update.
        private async Task<string?> ValidateAsync(ClientDto dto, int? excludeId)
        {
            if (!AllowedTypes.Contains(dto.ClientType))
                return "Client type must be External or Internal.";

            if (!AllowedStatuses.Contains(dto.Status))
                return "Status must be Active or Inactive.";

            if (await _clients.CnicExistsAsync(dto.CNIC.Trim(), excludeId))
                return "A client with this CNIC already exists.";

            return null;
        }

        private static ClientResponseDto ToDto(Client c) => new()
        {
            ClientID = c.ClientID,
            FullName = c.FullName,
            Email = c.Email,
            Phone = c.Phone,
            SecondaryPhone = c.SecondaryPhone,
            CNIC = c.CNIC,
            Address = c.Address,
            City = c.City,
            ClientType = c.ClientType,
            Status = c.Status,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        };
    }
}
