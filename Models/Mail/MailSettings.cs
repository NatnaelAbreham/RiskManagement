namespace RiskManagement.Mail.Models
{
    public class MailSettings
    {
        public string EmailHost { get; set; }
        public int EmailPort { get; set; }
        public string SenderName { get; set; }
        public string SenderEmail { get; set; }
        public bool EnableSsl { get; set; }
        public bool SMTPUseDefaultCredentials { get; set; }
        public string EmailUserName { get; set; }
        public string EmailPassword { get; set; }
        public string RetailAllowedProducts { get; set; }
    }
}