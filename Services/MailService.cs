using RiskManagement.Mail.Models;

namespace RiskManagement.Services
{
     public interface IMailService
 {
     Task<MailResponse> SendEmailAsync(MailRequest request);
 }

 public class MailService : IMailService
 {
     private readonly MailSettings _settings;

     public MailService(IOptions<MailSettings> settings)
     {
         _settings = settings.Value;
     }

     public async Task<MailResponse> SendEmailAsync(MailRequest request)
     {
         try
         {
             var email = new MimeMessage();
             email.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
             email.To.Add(MailboxAddress.Parse(request.ToEmail));
             email.Subject = request.Subject;
             email.Body = new BodyBuilder { HtmlBody = request.Body }.ToMessageBody();

             using var smtp = new SmtpClient();

             await smtp.ConnectAsync(
                 _settings.EmailHost,
                 _settings.EmailPort,
                 _settings.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None
             );

             smtp.AuthenticationMechanisms.Remove("XOAUTH2");
             smtp.AuthenticationMechanisms.Remove("LOGIN");
             smtp.AuthenticationMechanisms.Remove("PLAIN");

             if (_settings.SMTPUseDefaultCredentials)
             {
                 var ntlm = new SaslMechanismNtlm(System.Net.CredentialCache.DefaultNetworkCredentials);
                 await smtp.AuthenticateAsync(ntlm);
             }
             else if (!string.IsNullOrEmpty(_settings.EmailUserName))
             {
                 var ntlm = new SaslMechanismNtlm(_settings.EmailUserName, _settings.EmailPassword);
                 await smtp.AuthenticateAsync(ntlm);
             }

             await smtp.SendAsync(email);
             await smtp.DisconnectAsync(true);

             // You can log the last SMTP response
             var lastResponse = smtp.Capabilities.ToString(); // optional, for debug
             return new MailResponse
             {
                 Success = true,
                 Message = "Email sent successfully. SMTP server response: OK"
             };
         }
         catch (Exception ex)
         {
             return new MailResponse
             {
                 Success = false,
                 Message = ex.Message
             };
         }
     }
 }
}