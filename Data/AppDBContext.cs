using RiskManagement.Account.Models;
using RiskManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace RiskManagement.Data
{
      public class AppDBContext : DbContext
      {
            public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }
            public DbSet<User> Users { get; set; }
            public DbSet<RejectedRisk> RejectedRisks { get; set; }
            public DbSet<RiskRegistration> RiskRegistrations { get; set; }
            public DbSet<RiskSequence> RiskSequences { get; set; }
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

                  modelBuilder.Entity<RiskSequence>(entity =>
                 {
                       entity.ToTable("RiskSequence");
                       entity.HasKey(e => e.Id);
                       entity.Property(e => e.Prefix).HasMaxLength(10).IsRequired();
                       entity.Property(e => e.LastNumber).IsRequired();
                 });

                  modelBuilder.Entity<RiskRegistration>(entity =>
                 {
                       entity.ToTable("RiskRegistration");
                       entity.HasKey(e => e.Id);

                       // Id (Identity)
                       entity.Property(e => e.Id)
                      .ValueGeneratedOnAdd();
                       entity.Property(e => e.RiskId)
                                     .IsRequired()
                                     .HasColumnType("nvarchar(20)");
                       // Risk Information
                       entity.Property(e => e.RiskDate)
                       .IsRequired()
                       .HasColumnType("date");

                       entity.Property(e => e.IdentifiedRisk)
                       .IsRequired()
                       .HasColumnType("nvarchar(1000)");

                       entity.Property(e => e.SourceOfRisk)
                       .IsRequired()
                       .HasColumnType("nvarchar(max)");

                       entity.Property(e => e.RiskCategory)
                       .IsRequired()
                       .HasColumnType("nvarchar(1000)");

                       entity.Property(e => e.RiskEventDescription)
                       .IsRequired()
                       .HasColumnType("nvarchar(max)");

                       // Risk Assessment
                       entity.Property(e => e.Effect)
                       .IsRequired()
                       .HasColumnType("nvarchar(1000)");

                       entity.Property(e => e.Probability)
                       .IsRequired()
                       .HasPrecision(18, 2);

                       entity.Property(e => e.ImpactLevel)
                       .IsRequired()
                       .HasColumnType("nvarchar(50)");

                       entity.Property(e => e.RiskScore)
                       .IsRequired()
                       .HasPrecision(18, 2);

                       entity.Property(e => e.RiskRating)
                       .IsRequired()
                       .HasColumnType("nvarchar(1000)");

                       entity.Property(e => e.ResidualRiskLevel)
                       .IsRequired()
                       .HasColumnType("nvarchar(1000)");

                       // Mitigation & Controls
                       entity.Property(e => e.ExistingRiskMitigation)
                       .IsRequired()
                       .HasColumnType("nvarchar(max)");

                       entity.Property(e => e.MitigationRating)
                       .IsRequired()
                       .HasColumnType("nvarchar(1000)");

                       entity.Property(e => e.Recommendation)
                       .IsRequired()
                       .HasColumnType("nvarchar(max)");

                       // Ownership & Planning
                       entity.Property(e => e.MitigationPlannedDate)
                       .IsRequired()
                       .HasColumnType("date");

                       entity.Property(e => e.RiskOwner)
                       .IsRequired()
                       .HasColumnType("nvarchar(150)");

                       // Status (with default constraint)
                       entity.Property(e => e.Status)
                       .IsRequired()
                       .HasColumnType("nvarchar(20)")
                       .HasDefaultValue("Open");

                       // Audit Fields
                       entity.Property(e => e.RegisteredBy)
                       .IsRequired()
                       .HasColumnType("nvarchar(150)");

                       entity.Property(e => e.RegisteredDate)
                       .IsRequired()
                       .HasColumnType("datetime2");

                       entity.Property(e => e.ApprovedBy)
                       .HasColumnType("nvarchar(150)");

                       entity.Property(e => e.ApprovedDate)
                       .HasColumnType("datetime2");
                 });
                  modelBuilder.Entity<RejectedRisk>(entity =>
                  {
                        entity.ToTable("RejectedRisks");

                        entity.HasKey(e => e.Id);

                        entity.Property(e => e.RiskId)
                   .HasMaxLength(50)
                   .IsRequired();

                        entity.Property(e => e.RegisteredByBy)
                        .HasMaxLength(100)
                        .IsRequired();

                        entity.Property(e => e.RejectedBy)
                        .HasMaxLength(100)
                        .IsRequired();

                        entity.Property(e => e.RejectedOn)
                        .IsRequired();

                        entity.Property(e => e.Reason)
                        .IsRequired();
                  });
            }
      }
}
