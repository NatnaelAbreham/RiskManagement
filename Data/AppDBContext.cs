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
            modelBuilder.Entity<RiskRegistration>(entity =>
    {
        entity.ToTable("RiskRegistration");
        entity.HasKey(e => e.Id);

        // Risk Information
        entity.Property(e => e.RiskDate).IsRequired();
        entity.Property(e => e.IdentifiedRisk).IsRequired();
        entity.Property(e => e.SourceOfRisk).IsRequired();
        entity.Property(e => e.RiskCategory).IsRequired();
        entity.Property(e => e.RiskEventDescription).IsRequired();

        // Risk Assessment
        entity.Property(e => e.Effect).IsRequired();
        entity.Property(e => e.Probability)
              .HasPrecision(18, 2)
              .IsRequired();

        entity.Property(e => e.ImpactLevel).IsRequired();

        entity.Property(e => e.RiskScore)
              .HasPrecision(18, 2)
              .IsRequired();

        entity.Property(e => e.RiskRating).IsRequired();
        entity.Property(e => e.ResidualRiskLevel).IsRequired();

        // Mitigation & Controls
        entity.Property(e => e.ExistingRiskMitigation).IsRequired();
        entity.Property(e => e.MitigationRating).IsRequired();
        entity.Property(e => e.Recommendation).IsRequired();

        // Ownership & Planning
        entity.Property(e => e.MitigationPlannedDate).IsRequired();
        entity.Property(e => e.RiskOwner).IsRequired();

        entity.Property(e => e.Status)
              .IsRequired()
              .HasDefaultValue("Open");

        // Audit Fields
        entity.Property(e => e.RegisteredBy).IsRequired();
        entity.Property(e => e.RegisteredDate).IsRequired();

        entity.Property(e => e.ApprovedBy);
        entity.Property(e => e.ApprovedDate);
    });
        }
    }
}
