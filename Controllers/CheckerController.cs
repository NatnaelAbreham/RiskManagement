using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Data;
using RiskManagement.Models;

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
            CheckerDashboard model = new CheckerDashboard();

            model.TotalRisk = _context.RiskRegistrations.Count();

            model.OpenRisk = _context.RiskRegistrations
                .Count(x => x.Status == "Open");

            model.ClosedRisk = _context.RiskRegistrations
                .Count(x => x.Status == "Closed");

            model.HighRisk = _context.RiskRegistrations
                .Count(x => x.RiskRating == "High");

            model.DueSoon = _context.RiskRegistrations
                .Count(x => x.MitigationPlannedDate <= DateTime.Today.AddDays(7));

            model.RecentRisks = _context.RiskRegistrations
                .OrderByDescending(x => x.RiskDate)
                .Take(10)
                .ToList();

            model.TopRisk = _context.RiskRegistrations
                .OrderByDescending(x => x.RiskScore)
                .Take(10)
                .ToList();

            return View(model);
        }

        [HttpGet("Profile")]
        public IActionResult Profile()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetRiskTrend()
        {
            var data = _context.RiskRegistrations
                .GroupBy(r => new { r.RiskDate.Year, r.RiskDate.Month })
                .Select(g => new
                {
                    Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                    Count = g.Count()
                })
                .OrderBy(x => DateTime.ParseExact(x.Month, "MMM yyyy", null))
                .ToList();

            return Json(data);
        }

    }
}