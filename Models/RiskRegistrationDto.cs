namespace RiskManagement.Models
{
    public class RiskRegistrationDto
    {
        public DateTime RiskDate { get; set; }
        public string IdentifiedRisk { get; set; }
        public string SourceOfRisk { get; set; }
        public string RiskCategory { get; set; }
        public string RiskEventDescription { get; set; }

        public string Effect { get; set; }
        public decimal Probability { get; set; }
        public string ImpactLevel { get; set; }

        public decimal RiskScore { get; set; }
        public string RiskRating { get; set; }
        public string ResidualRiskLevel { get; set; }

        public string ExistingRiskMitigation { get; set; }
        public string MitigationRating { get; set; }
        public string Recommendation { get; set; }

        public DateTime MitigationPlannedDate { get; set; }
        public string RiskOwner { get; set; }
    }
}