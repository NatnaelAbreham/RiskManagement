using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Data;
using RiskManagement.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace RiskManagement.Controllers
{
    [Route("Checker")]
    [Authorize(Roles = "Checker")]
    public class CheckerController : Controller
    {

        public CheckerController(AppDBContext context) => _context = context;
        private readonly AppDBContext _context;


        [HttpGet("Record")]
        public IActionResult ViewRecord()
        {
            // var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var filteredUsers = _context.RiskRegistrations
          .Where(u => u.Status == "pending")
          .OrderByDescending(u => u.Id)
          .ToList();
            return View("Record", filteredUsers);
        }
        [HttpGet("Report")]
        public IActionResult Report()
        {
            return View();
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
        [HttpGet("GetUpcomingDeadlines")]
        public JsonResult GetUpcomingDeadlines()
        {
            var today = DateTime.Today;
            var next30Days = today.AddDays(30);

            var data = _context.RiskRegistrations
       .Where(r => r.MitigationPlannedDate >= today &&
                   r.MitigationPlannedDate <= next30Days)
       .GroupBy(r => r.MitigationPlannedDate.Date)
       .Select(g => new
       {
           Date = g.Key,
           Count = g.Count()
       })
       .OrderBy(x => x.Date)
       .ToList()           // SQL ends here
       .Select(x => new
       {
           Date = x.Date.ToString("dd MMM"),
           Count = x.Count
       })
       .ToList();

            return Json(data);
        }

        [HttpPost("approve")]
        public IActionResult Approve([FromBody] ApproveRequest model)
        {
            var record = _context.RiskRegistrations.FirstOrDefault(x => x.RiskId == model.RiskId);
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            if (record == null)
                return NotFound();

            record.Status = "approved";
            record.ApprovedBy = email;
            record.ApprovedDate = DateTime.Now;

            _context.SaveChanges();

            return Ok(new { message = "Approved successfully!" });
        }

        [HttpPost("reject")]
        public IActionResult RecordRejected([FromBody] RejectedRisk model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);


            var record = _context.RiskRegistrations.FirstOrDefault(x => x.RiskId == model.RiskId);

            if (record == null)
                return NotFound();

            record.Status = "rejected";
            _context.SaveChanges();

            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            model.RegisteredBy = record.RegisteredBy;
            model.RejectedBy = email;
            model.RejectedOn = DateTime.Now;

            _context.RejectedRisks.Add(model);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Risk record rejected successfully",
                QueueNumber = model.RiskId,
                data = model
            });
        }

        [HttpGet("GetIdentifiedRisks")]
        public async Task<IActionResult> GetIdentifiedRisks()
        {
            var risks = await _context.RiskRegistrations
                .Where(x => !string.IsNullOrEmpty(x.IdentifiedRisk))
                .Select(x => x.IdentifiedRisk)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync();

            return Json(risks);
        }

        [HttpGet("GetReportData")]
        public async Task<IActionResult> GetReportData(
            string? identifiedRisk,
            string? status,
            string? rating,
            DateTime? fromDate,
            DateTime? toDate)
        {
            var query = _context.RiskRegistrations.AsQueryable();

            // Identified Risk
            if (!string.IsNullOrWhiteSpace(identifiedRisk))
            {
                query = query.Where(x => x.IdentifiedRisk == identifiedRisk);
            }

            // Status
            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(x => x.Status == status);
            }

            // Rating
            if (!string.IsNullOrWhiteSpace(rating))
            {
                query = query.Where(x => x.RiskRating == rating);
            }

            // From Date
            if (fromDate.HasValue)
            {
                query = query.Where(x => x.RiskDate >= fromDate.Value);
            }

            // To Date
            if (toDate.HasValue)
            {
                query = query.Where(x => x.RiskDate <= toDate.Value);
            }

            var risks = await query
                .OrderByDescending(x => x.RegisteredDate)
                .ToListAsync();

            return Json(risks);
        }
    }
}