using System;
using System.ComponentModel.DataAnnotations;

namespace RiskManagement.Models
{
    public class RiskRegistration
    {
        public int Id { get; set; }
        public string RiskId { get; set; }   // DB000001, CR000001

        // SECTION 1: RISK INFORMATION
        public DateTime RiskDate { get; set; }
        public string IdentifiedRisk { get; set; }
        public string SourceOfRisk { get; set; }
        public string RiskCategory { get; set; }
        public string RiskEventDescription { get; set; }

        // SECTION 2: RISK ASSESSMENT
        public string Effect { get; set; }
        public decimal Probability { get; set; }
        public string ImpactLevel { get; set; }
        public decimal RiskScore { get; set; }
        public string RiskRating { get; set; }
        public string ResidualRiskLevel { get; set; }

        // SECTION 3: MITIGATION & CONTROLS
        public string ExistingRiskMitigation { get; set; }
        public string MitigationRating { get; set; }
        public string Recommendation { get; set; }

        // SECTION 4: OWNERSHIP & PLANNING
        public DateTime MitigationPlannedDate { get; set; }
        public string RiskOwner { get; set; }
        public string Status { get; set; } = "Open";

        // AUDIT FIELDS
        public string RegisteredBy { get; set; }
        public DateTime RegisteredDate { get; set; }

        public string? ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
    }
}