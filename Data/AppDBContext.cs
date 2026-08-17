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
        public DbSet<IncidentRegistration> IncidentRecords { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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
               entity.Property(e => e.RiskSubCategory)
                     .IsRequired()
                     .HasColumnType("nvarchar(500)");

               entity.Property(e => e.RiskEvent)
                                            .IsRequired()
                                            .HasColumnType("nvarchar(255)");


               entity.Property(e => e.RiskEventDescription)
                     .IsRequired()
                     .HasColumnType("nvarchar(max)");

               // Risk Assessment
               entity.Property(e => e.Effect)
                     .IsRequired()
                     .HasColumnType("nvarchar(1000)");

               entity.Property(e => e.Probability)
                    .IsRequired()
                    .HasColumnType("nvarchar(50)");

               entity.Property(e => e.ImpactLevel)
                     .IsRequired()
                     .HasColumnType("nvarchar(50)");


               entity.Property(e => e.InherentRiskRating)
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
                     .HasColumnType("nvarchar(max)");

               // Ownership & Planning
               entity.Property(e => e.MitigationPlannedDate)
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

               entity.Property(e => e.BranchId)
                     .IsRequired()
                     .HasColumnType("nvarchar(25)");

               entity.Property(e => e.BranchName)
                     .IsRequired()
                     .HasColumnType("nvarchar(255)");

               entity.Property(e => e.ApprovedBy)
                     .HasColumnType("nvarchar(150)");

               entity.Property(e => e.ApprovedDate)
                     .HasColumnType("datetime2");
               entity.Property(e => e.FilePath)
                     .HasColumnType("nvarchar(500)");
           });
            modelBuilder.Entity<RejectedRisk>(entity =>
            {
                entity.ToTable("RejectedRisks");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.RiskId)
                 .HasMaxLength(50)
                 .IsRequired();

                entity.Property(e => e.RegisteredBy)
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
            modelBuilder.Entity<IncidentRegistration>(entity =>
{
entity.ToTable("IncidentRecords");

entity.HasKey(e => e.Id);

    // =========================
    // Incident Information
    // =========================

entity.Property(e => e.IncidentId)
  .HasMaxLength(100)
  .IsRequired();

entity.Property(e => e.IdentifiedRisk)
  .HasMaxLength(200)
  .IsRequired();

entity.Property(e => e.IncidentName)
  .HasMaxLength(200)
  .IsRequired();

entity.Property(e => e.IncidentOwner)
  .HasMaxLength(200)
  .IsRequired();

entity.Property(e => e.EventOccurredDate)
  .IsRequired();

entity.Property(e => e.EventEndedDate)
  .IsRequired();

entity.Property(e => e.Priority)
  .HasMaxLength(50)
  .IsRequired();

entity.Property(e => e.SourceOfIncident)
  .HasMaxLength(200)
  .IsRequired();

entity.Property(e => e.EventDescription)
  .IsRequired();

entity.Property(e => e.EventType)
  .HasMaxLength(200)
  .IsRequired();

entity.Property(e => e.BusinessLine)
  .HasMaxLength(200)
  .IsRequired();

entity.Property(e => e.BusinessActivity)
  .HasMaxLength(200)
  .IsRequired();


    // =========================
    // Impact Parameters
    // =========================

entity.Property(e => e.LossType)
  .HasMaxLength(200)
  .IsRequired(false);

entity.Property(e => e.LossDate)
  .IsRequired(false);

entity.Property(e => e.Insurance)
  .HasMaxLength(200)
  .IsRequired(false);

entity.Property(e => e.LossAmount)
  .HasPrecision(18, 2)
  .IsRequired(false);

entity.Property(e => e.RecoveryAmount)
  .HasPrecision(18, 2)
  .IsRequired(false);

entity.Property(e => e.NetLossAmount)
  .HasPrecision(18, 2)
  .IsRequired(false);


    // =========================
    // Mitigation
    // =========================

entity.Property(e => e.MitigationAction)
  .HasMaxLength(100)
  .IsRequired(false);

entity.Property(e => e.ActionType)
  .HasMaxLength(200)
  .IsRequired(false);

entity.Property(e => e.ResponsiblePerson)
  .HasMaxLength(200)
  .IsRequired(false);

entity.Property(e => e.MitigationDescription)
  .IsRequired(false);

entity.Property(e => e.MitigationStartDate)
  .IsRequired(false);

entity.Property(e => e.MitigationEndDate)
  .IsRequired(false);


    // =========================
    // Status
    // =========================

entity.Property(e => e.Status)
  .HasMaxLength(50)
  .IsRequired(false);


    // =========================
    // Registration Information
    // =========================

entity.Property(e => e.RegisteredBy)
  .HasMaxLength(100)
  .IsRequired();

entity.Property(e => e.RegisteredDate)
  .IsRequired()
  .HasDefaultValueSql("SYSUTCDATETIME()");

entity.Property(e => e.BranchId)
  .HasMaxLength(50)
  .IsRequired();

entity.Property(e => e.BranchName)
  .HasMaxLength(200)
  .IsRequired();


    // =========================
    // Approval Information
    // =========================

entity.Property(e => e.ApprovedBy)
  .HasMaxLength(100)
  .IsRequired(false);

entity.Property(e => e.ApprovedDate)
  .IsRequired(false);
});
        }
    }
}
