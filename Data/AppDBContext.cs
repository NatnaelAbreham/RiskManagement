using RiskManagement.Account.Models;
using RiskManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace RiskManagement.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<RiskRegistration> RiskRegistrations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Existing configuration for fcy
            modelBuilder.Entity<User>(entity =>
           {
                entity.ToTable("Users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FullName).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Email).HasMaxLength(256).IsRequired();
                entity.Property(e => e.Phone).HasMaxLength(30);
                entity.Property(e => e.Status).HasMaxLength(20).IsRequired().HasDefaultValue("1");
                entity.Property(e => e.Role).HasMaxLength(50).IsRequired().HasDefaultValue("124451");
                entity.Property(e => e.CreatedOn).IsRequired().HasDefaultValueSql("SYSUTCDATETIME()");
           });
        }
    }
}
 