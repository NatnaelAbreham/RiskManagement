using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Models;

namespace RiskManagement.Controllers
{
    [ApiController]
    [Route("mail")]
    public class AccountController : Controller
    {

        private readonly IMailService _mailService;
        private readonly IHttpClientFactory _httpClientFactory;

        public AccountController(IMailService mailService, IHttpClientFactory httpClientFactory)
        {
            _mailService = mailService;
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] MailRequest request)
        {
            

            string zenUserName = _configuration["MailSettings:ZenUsername"];
            string zenPassword = _configuration["MailSettings:ZenPassword"];

            int successCount = 0, failCount = 0;
            string responseMessage = "";

            // 1️⃣ Validate credentials
            if (request.UserName != zenUserName || request.Password != zenPassword)
            {
                _smsLogger.LogWarning(
                    "TraceId: {TraceId} - Unauthorized access attempt with Username: {Username}",
                    traceId, request.UserName
                );

                logBuilder.AppendLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss}\tTraceId: {traceId} - Unauthorized access attempt with Username: {request.UserName}");

                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = $"Unauthorized access attempt with Username: {request.UserName}"
                });
            }

            // 2️⃣ Set service name for log file
            LogWriter.Service_Name = request.ToEmail + "_" + traceId;

            // 3️⃣ Prepare payload for logging (mask password)
            var payloadLog = new
            {
                ToEmail = request.ToEmail,
                Subject = request.Subject,
                Body = request.Body,
                UserName = request.UserName,
                Password = "********"
            };

            try
            {
                // Log request
                logBuilder.AppendLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss}")
                          .Append("TraceId: ").Append(traceId)
                          .Append(" - Sending Email to ").Append(request.ToEmail)
                          .Append(". Payload: ")
                          .Append(JsonConvert.SerializeObject(payloadLog, Newtonsoft.Json.Formatting.Indented));

                _smsLogger.LogInformation(
                    "TraceId: {TraceId} - Sending Email to {ToEmail}. Payload: {Payload}",
                    traceId, request.ToEmail, System.Text.Json.JsonSerializer.Serialize(payloadLog)
                );

                // 4️⃣ Send email and capture response
                var mailResponse = await _mailService.SendEmailAsync(request);

                if (mailResponse.Success)
                {
                    successCount++;
                    responseMessage = mailResponse.Message;

                    logBuilder.AppendLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss}\tTraceId: {traceId} - Email sent successfully to {request.ToEmail}")
                              .AppendLine("SMTP/API Response:")
                              .AppendLine(mailResponse.Message);

                    _smsLogger.LogInformation(
                        "TraceId: {TraceId} - Email sent to {ToEmail}. SMTP Response: {Response}",
                        traceId, request.ToEmail, mailResponse.Message
                    );
                }
                else
                {
                    failCount++;
                    responseMessage = mailResponse.Message;

                    logBuilder.AppendLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss}\tTraceId: {traceId} - Failed to send Email to {request.ToEmail}")
                              .AppendLine("SMTP/API Response:")
                              .AppendLine(mailResponse.Message);

                    _smsLogger.LogWarning(
                        "TraceId: {TraceId} - Failed to send email to {ToEmail}. SMTP Response: {Response}",
                        traceId, request.ToEmail, mailResponse.Message
                    );
                }
            }
            catch (Exception ex)
            {
                failCount++;
                responseMessage = ex.Message;

                logBuilder.AppendLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss}\tERROR\tTraceId: {traceId}")
                          .AppendLine($"Unexpected Error sending Email to {request.ToEmail}")
                          .AppendLine("Exception Details:")
                          .AppendLine(ex.ToString());

                _smsLogger.LogError(ex, "TraceId: {TraceId} - Unexpected Error sending Email to {ToEmail}", traceId, request.ToEmail);
            }
            finally
            {
                // 5️⃣ Write logs to file
                _logWriter.LogRequestResponse(logBuilder);
            }

            // 6️⃣ Final summary log
            string resultMessage = $"Email processing completed: {successCount} successful, {failCount} failed.";
            _smsLogger.LogInformation("TraceId: {TraceId} - {Message}", traceId, resultMessage);

            return Ok(new
            {
                StatusCode = successCount > 0 ? 200 : 500,
                Message = responseMessage
            });
        }



    }
}