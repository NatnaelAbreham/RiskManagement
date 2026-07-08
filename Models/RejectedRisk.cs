using System.ComponentModel.DataAnnotations;
namespace RiskManagement.Models
{
    public class RejectedRisk
    {
        [Key]
        public int Id { get; set; }
        public string RiskId { get; set; }
        public string RegisteredByBy { get; set; }
        public string RejectedBy { get; set; }
        public DateTime? RejectedOn { get; set; } = DateTime.Now;
        public string Reason { get; set; }

    }
}