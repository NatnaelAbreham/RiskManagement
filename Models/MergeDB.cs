namespace RiskManagement.Models
{
    public class MergeDB
    {
        public List<RiskRegistration> UserData { get; set; }
        public Dictionary<string, RejectedRisk> RejectedInfoMap { get; set; }
    }
}