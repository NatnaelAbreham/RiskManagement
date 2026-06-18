using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using RiskManagement.Mail.Models;

namespace RiskManagement.Services
{
    public interface IMailService
    {
        Task<MailResponse> ValidateOutlookCredentialsAsync(
            string email,
            string password);
    }

    public class MailService : IMailService
    {
        private readonly MailSettings _settings;

        public MailService(IOptions<MailSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task<MailResponse> ValidateOutlookCredentialsAsync(
            string email,
            string password)
        {
            try
            {
                using var smtp = new SmtpClient();

                await smtp.ConnectAsync(
                    _settings.EmailHost,
                    _settings.EmailPort,
                    _settings.EnableSsl
                        ? SecureSocketOptions.StartTls
                        : SecureSocketOptions.None);

                await smtp.AuthenticateAsync(
                    email,
                    password);

                await smtp.DisconnectAsync(true);

                return new MailResponse
                {
                    Success = true,
                    Message = "Authentication successful."
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