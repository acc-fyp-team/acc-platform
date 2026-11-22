namespace Backend.Models.DTOs
{
    // What the server sends back about a client.
    public class ClientResponseDto
    {
        public int ClientID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string? SecondaryPhone { get; set; }
        public string CNIC { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }
        public string ClientType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
