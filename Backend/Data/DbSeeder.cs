using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    // On a brand-new database there is nobody to sign in as, so the first
    // admin account is created here. It runs only when the Users table is empty.
    public static class DbSeeder
    {
        public static async Task SeedAdminAsync(AppDbContext db, IConfiguration config)
        {
            if (await db.Users.AnyAsync())
                return;

            var username = config["Seed:AdminUsername"] ?? "admin";
            var password = config["Seed:AdminPassword"] ?? "Admin@12345";

            db.Users.Add(new User
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Email = "admin@accplatform.local",
                FullName = "System Administrator",
                Role = "Admin",
                IsActive = true
            });

            await db.SaveChangesAsync();
        }
    }
}
