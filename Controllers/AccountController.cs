using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Mail.Models;
using RiskManagement.Account.Models;
using RiskManagement.Services;
using RiskManagement.Data;

namespace RiskManagement.Controllers
{
    [ApiController]
    [Route("mail")]
    public class AccountController : Controller
    {

        private readonly IMailService _mailService;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly AppDBContext _context;

        public AccountController(IMailService mailService, IHttpClientFactory httpClientFactory, AppDBContext context)
        {
            _mailService = mailService;
            _httpClientFactory = httpClientFactory;
            _context = context;
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

        [HttpPost("adduser")]
public async Task<IActionResult> AddUser([FromBody] CreateUserDto dto)
{
    var user = new User
    {
        FullName = dto.FullName,
        Email = dto.Email,
        Phone = dto.Phone,
        Status = dto.Status,
        Role = dto.Role,
        CreatedOn = DateTime.UtcNow
    };

    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "User added successfully",
        data = user
    });
}




    }
}