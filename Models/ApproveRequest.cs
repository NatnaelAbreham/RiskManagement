namespace RiskManagement.Models
{
    public class ApproveRequest
    {
        public string RiskId { get; set; }
        public string? ApprovedBy { get; set; }
    }
}