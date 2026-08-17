using System.ComponentModel.DataAnnotations;

namespace RiskManagement.Models
{
    public class IncidentRegistrationDto
    {
        // =========================
        // Incident Information
        // =========================

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


        // =========================
        // Impact Parameters
        // =========================

        public string? LossType { get; set; }

        public DateTime? LossDate { get; set; }

        public string? Insurance { get; set; }

        public decimal? LossAmount { get; set; }

        public decimal? RecoveryAmount { get; set; }

        public decimal? NetLossAmount { get; set; }


        // =========================
        // Mitigation
        // =========================

        public string? MitigationAction { get; set; }

        public string? ActionType { get; set; }

        public string? ResponsiblePerson { get; set; }

        public string? MitigationDescription { get; set; }

        public DateTime? MitigationStartDate { get; set; }

        public DateTime? MitigationEndDate { get; set; }


        // =========================
        // Status
        // =========================

        public string? Status { get; set; }
    }
}