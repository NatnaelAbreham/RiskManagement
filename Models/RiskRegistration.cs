using System;
using System.ComponentModel.DataAnnotations;

namespace RiskManagement.Models
{
    public class RiskRegistration
    {
        // SECTION 1: RISK INFORMATION
        public int Id { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime RiskDate { get; set; }

        [Required]
        [StringLength(100)]
        public string IdentifiedRisk { get; set; }

        [Required]
        [StringLength(200)]
        public string SourceOfRisk { get; set; }

        [Required]
        [StringLength(100)]
        public string RiskCategory { get; set; }

        [Required]
        [StringLength(2000)]
        public string RiskEventDescription { get; set; }

        // SECTION 2: RISK ASSESSMENT

        [Required]
        [StringLength(200)]
        public string Effect { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal Probability { get; set; }

        [Required]
        public string ImpactLevel { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal RiskScore { get; set; }

        [Required]
        public string RiskRating { get; set; }

        [Required]
        public string ResidualRiskLevel { get; set; }

        // SECTION 3: MITIGATION & CONTROLS

        [Required]
        [StringLength(2000)]
        public string ExistingRiskMitigation { get; set; }

        [Required]
        public string MitigationRating { get; set; }

        [Required]
        [StringLength(2000)]
        public string Recommendation { get; set; }

        // SECTION 4: OWNERSHIP & PLANNING

        [Required]
        [DataType(DataType.Date)]
        public DateTime MitigationPlannedDate { get; set; }

        [Required]
        [StringLength(150)]
        public string RiskOwner { get; set; }

        [Required]
        public string Status { get; set; } = "Open";
//===========================
        [Required]
        [StringLength(150)]
        public string RegisteredBy { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime RegisteredDate { get; set; }
         [Required]
        [StringLength(150)]
        public string? ApprovedBy { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime? ApprovedDate { get; set; }
    }
}