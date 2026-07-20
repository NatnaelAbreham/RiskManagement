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
            var email = dto.Email.Trim().ToLower();
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

            var user = new User
            {
                FullName = dto.FullName,
                Email = email,
                Phone = phone,
                Status = dto.Status,
                Role = dto.Role,
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
    }
}
