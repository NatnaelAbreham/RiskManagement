namespace RiskManagement.Mail.Models
{
    public class MailResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } // actual response from SMTP
    }
}