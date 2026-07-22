using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Data;
using RiskManagement.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using RiskManagement.Account.Models;



namespace RiskManagement.Controllers
{
    [Route("Admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        public AdminController(AppDBContext context) => _context = context;
        private readonly AppDBContext _context;

        [HttpGet("AddUser")]
        public IActionResult AddUser()
        {
            return View();
        }
        [HttpPost("adduser")]
        public async Task<IActionResult> AddUser([FromBody] CreateUserDto dto)
        {
            var email = NormalizeEmail(dto.Email);
            var phone = dto.Phone?.Trim();

            var existingUser = await _context.Users.FirstOrDefaultAsync(x =>
                x.Email.ToLower() == email ||
                (!string.IsNullOrEmpty(phone) && x.Phone == phone));

            if (existingUser != null)
            {
                if (existingUser.Email.ToLower() == email)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "A user with this email already exists."
                    });
                }

                if (!string.IsNullOrEmpty(phone) && existingUser.Phone == phone)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "A user with this phone number already exists."
                    });
                }
            }


            string role;

            if (dto.Role == "Maker")
                role = "124451";
            else if (dto.Role == "Checker")
                role = "125451";
            else if (dto.Role == "Admin")
                role = "124551";
            else
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid role selected."
                });
            }

            var user = new User
            {
                FullName = dto.FullName,
                Email = email,
                Phone = phone,
                Status = dto.Status,
                Role = role,
                CreatedOn = DateTime.UtcNow
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "User added successfully.",
                data = user
            });
        }


        [HttpGet("Users")]
        public IActionResult Users()
        {

            var filteredUsers = _context.Users
          .OrderByDescending(u => u.Id)
          .ToList();


            return View("Users", filteredUsers);
        }
        [HttpGet("Profile")]
        public IActionResult Profile()
        {
            return View();
        }
        [HttpGet("Dashboard")]
        public IActionResult Dashboard()
        {
            return View();
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
