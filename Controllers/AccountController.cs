using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Mail.Models;
using RiskManagement.Account.Models;
using RiskManagement.Services;
using RiskManagement.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace RiskManagement.Controllers
{
  /*   [ApiController] */
    [Route("")]
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

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();

            return RedirectToAction("");
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
            var email = dto.Email.Trim().ToLower();

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(x => x.Email.ToLower() == email);

            if (existingUser != null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "A user with this email already exists."
                });
            }

            var user = new User
            {
                FullName = dto.FullName,
                Email = email,
                Phone = dto.Phone,
                Status = dto.Status,
                Role = dto.Role,
                CreatedOn = DateTime.UtcNow
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "User added successfully",
                data = user
            });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] OutlookLoginRequest request)
        {
            // 0. Normalize email
            var email = NormalizeEmail(request.Email);

            // 1. Whitelist check
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == email);

             if (user == null)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Access denied, user do not have access on the platform."
                });
            }

            // 2. Outlook validation
           /*  var result = await _mailService.ValidateOutlookCredentialsAsync(
                email,
                request.Password);

  
            if (!result.Success)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "The user name or password you entered isn't correct. Try entering it again."
                });
            } */

            var roleName = user.Role switch
            {
                "124451" => "Maker",
                "125451" => "Checker",
                _ => "Unknown"
            };

            // ✅ CREATE COOKIE AUTHENTICATION
            var claims = new List<Claim>
{
    new Claim(ClaimTypes.Name, user.FullName),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.Role, roleName),
    new Claim(ClaimTypes.MobilePhone, user.Phone ?? "")
};

            var claimsIdentity = new ClaimsIdentity(
                claims,
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity)
            );


            string redirectUrl = roleName switch
            {
                "Maker" => "/Maker/Dashboard",
                "Checker" => "/Checker/Dashboard",
                _ => "/Account/Login"
            };

            return Ok(new
            {
                success = true,
                message = "Login successful",
                redirectUrl
            });
            // 3. Success response
        }
        private async Task<MailResponse> ValidateOutlookCredentials(string email, string password)
        {
            return await _mailService.ValidateOutlookCredentialsAsync(email, password);
        }
        private string NormalizeEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return email;

            email = email.Trim().ToLower();

            const string domain = "@tsedeybank.com.et";

            if (!email.Contains("@"))
            {
                email = email + domain;
            }

            return email;
        }
    }
}