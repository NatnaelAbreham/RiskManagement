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

    }
}
