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

        [HttpGet("GetRiskTrend")]
        public JsonResult GetRiskTrend()
        {
            var trend = _context.RiskRegistrations
            .GroupBy(r => new
            {
                r.RiskDate.Year,
                r.RiskDate.Month
            })
            .OrderBy(g => g.Key.Year)
    .ThenBy(g => g.Key.Month)
    .Select(g => new
    {
        Year = g.Key.Year,
        Month = g.Key.Month,
        Count = g.Count()
    })
    .ToList()
    .Select(x => new
    {
        Month = new DateTime(x.Year, x.Month, 1).ToString("MMM yyyy"),
        x.Count
    })
    .ToList();

            return Json(trend);
        }

        [HttpGet("GetRiskRating")]
        public JsonResult GetRiskRating()
        {
            var data = _context.RiskRegistrations
                .GroupBy(r => r.RiskRating)
                .Select(g => new
                {
                    Rating = g.Key,
                    Count = g.Count()
                })
                .OrderBy(x => x.Rating)
                .ToList();

            return Json(data);
        }
        [HttpGet("GetRiskCategory")]
        public JsonResult GetRiskCategory()
        {
            var data = _context.RiskRegistrations
                .Where(r => !string.IsNullOrWhiteSpace(r.RiskCategory))
                .GroupBy(r => r.RiskCategory.Trim())
                .Select(g => new
                {
                    Category = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .ToList();

            return Json(data);
        }
        [HttpGet("GetStatusDistribution")]
        public JsonResult GetStatusDistribution()
        {
            var data = _context.RiskRegistrations
                .Where(r => !string.IsNullOrWhiteSpace(r.Status))
                .GroupBy(r => r.Status.Trim())
                .Select(g => new
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .OrderBy(x => x.Status)
                .ToList();

            return Json(data);
        }
    }
}