using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Data;

namespace RiskManagement.Controllers
{
    [Route("Checker")]
    [Authorize(Roles = "Checker")]
    public class CheckerController : Controller
    {

        public CheckerController(AppDBContext context) => _context = context;
        private readonly AppDBContext _context;

        [HttpGet("View")]
        public IActionResult ViewRecord()
        {
           // var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var filteredUsers = _context.RiskRegistrations
          //.Where(u => u.RegisteredBy == email)
          .OrderByDescending(u => u.Id)
          .ToList();
            return View("View", filteredUsers);
        }

        [HttpGet("Dashboard")]
        public IActionResult Dashboard()
        {
            return View();
        }

        [HttpGet("Profile")]
        public IActionResult Profile()
        {
            return View();
        }

    }
}