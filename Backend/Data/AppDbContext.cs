using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    // The application's single gateway to the database.
    // Every DbSet below becomes a table. More are added as modules are built.
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<UserPermission> UserPermissions => Set<UserPermission>();
        public DbSet<Client> Clients => Set<Client>();
        public DbSet<Employee> Employees => Set<Employee>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // A username can only be used once.
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // One row per user + module + action, so a permission can never be stored twice.
            modelBuilder.Entity<UserPermission>()
                .HasIndex(p => new { p.UserID, p.Module, p.Action })
                .IsUnique();

            // Two clients can never share a CNIC.
            modelBuilder.Entity<Client>()
                .HasIndex(c => c.CNIC)
                .IsUnique();

            // Employee CNIC is optional, but two employees can't share one.
            // PostgreSQL treats NULLs as different, so blank CNICs are fine.
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.CNIC)
                .IsUnique();
        }
    }
}
