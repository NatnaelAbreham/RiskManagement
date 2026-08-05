using System.ComponentModel.DataAnnotations;

namespace RiskManagement.Models
{
    public class IncidentRegistration
    {
        public int Id { get; set; }
        public string IncidentId { get; set; }

        public string IdentifiedRisk { get; set; }


        public string IncidentName { get; set; }


        public string IncidentOwner { get; set; }


        public DateTime EventOccurredDate { get; set; }


        public DateTime EventEndedDate { get; set; }


        public string Priority { get; set; }


        public string SourceOfIncident { get; set; }


        public string EventDescription { get; set; }


        public string EventType { get; set; }


        public string BusinessLine { get; set; }


        public string BusinessActivity { get; set; }

        public string RegisteredBy { get; set; }
        public DateTime RegisteredDate { get; set; }
        public string BranchId { get; set; }
        public string BranchName { get; set; }

        public string? ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
    }
}