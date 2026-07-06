namespace RiskManagement.Models
{
    public class CheckerDashboard
    {
        public int TotalRisk { get; set; }
        public int OpenRisk { get; set; }
        public int ClosedRisk { get; set; }
        public int HighRisk { get; set; }
        public int DueSoon { get; set; }

        public List<RiskRegistration> RecentRisks { get; set; }

        public List<RiskRegistration> TopRisk { get; set; }
    }
}