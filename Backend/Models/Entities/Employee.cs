using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{
    // A company employee (the Employees table).
    public class Employee
    {
        [Key]
        public int EmployeeID { get; set; }

        [Required]
        [MaxLength(50)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(15)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(15)]
        public string? SecondaryPhone { get; set; }

        // Optional here (unlike a client), but must be unique when given.
        [MaxLength(15)]
        public string? CNIC { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        [MaxLength(50)]
        public string? City { get; set; }

        // Free text typed by the admin, not a fixed list (eg Mason, Site Engineer)
        [Required]
        [MaxLength(50)]
        public string Designation { get; set; } = string.Empty;

        // A calendar date with no time, so no timezone confusion.
        public DateOnly? JoiningDate { get; set; }

        // Active or Inactive
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Active";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
