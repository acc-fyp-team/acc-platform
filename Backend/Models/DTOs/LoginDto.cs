namespace Backend.Models.DTOs
{
    // What the client sends to sign in.
    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        // "Keep me signed in": 30 days instead of the normal 12 hours.
        public bool KeepSignedIn { get; set; }
    }
}
