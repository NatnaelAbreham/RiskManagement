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
                .Select(u => new User
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Status = u.Status,
                    CreatedOn = u.CreatedOn,
                    Role = u.Role == "124451" ? "Maker" :
                           u.Role == "125451" ? "Checker" :
                           u.Role == "124551" ? "Admin" :
                           "Unknown"
                })
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
        [HttpPost("edituser")]
        public IActionResult UpdateUser([FromBody] User model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid input", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
            }

            var user = _context.Users.FirstOrDefault(a => a.Id == model.Id);
            if (user == null)
            {
                return NotFound(new { message = "Record with this  ID not found" });
            }


            if (model.Role == "Maker")
                user.Role = "124451";
            if (model.Role == "Checker")
                user.Role = "125451";
            if (model.Role == "Admin")
                user.Role = "124551";
            else
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid role selected."
                });
            }
            user.Email = model.Email;
            user.Phone = model.Phone;
            user.Status = model.Status;
            user.FullName = model.FullName;

            _context.SaveChanges();

            return Ok(new { StatusCode = 200, success = true, message = "User profile updated successfully", data = user });
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
