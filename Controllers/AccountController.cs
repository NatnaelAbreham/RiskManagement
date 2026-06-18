using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Mail.Models;
using RiskManagement.Services;

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

        [HttpPost("validate")]
        public async Task<IActionResult> Validate([FromBody] OutlookLoginRequest request)
        {
            var result = await _mailService
                .ValidateOutlookCredentialsAsync(
                    request.Email,
                    request.Password);

            return Ok(result);
        }

    }
}