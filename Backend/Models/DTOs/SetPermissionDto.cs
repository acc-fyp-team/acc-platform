namespace Backend.Models.DTOs
{
    // What an admin sends to grant or remove one permission.
    public class SetPermissionDto
    {
        public int UserID { get; set; }
        public string Module { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public bool IsAllowed { get; set; }
        public bool RequiresApproval { get; set; }
    }
}
