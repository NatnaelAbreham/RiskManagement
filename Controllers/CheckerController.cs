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


        [HttpGet("ViewAll")]
        public IActionResult ViewAll()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var filteredUsers = _context.RiskRegistrations
          //.Where(u => u.RegisteredBy == email)
          .OrderByDescending(u => u.Id)
          .ToList();
            return View("View", filteredUsers);
        }
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
                .Count(x => x.InherentRiskRating == "High");

            model.DueSoon = _context.RiskRegistrations
                .Count(x => x.MitigationPlannedDate <= DateTime.Today.AddDays(7));

            model.RecentRisks = _context.RiskRegistrations
                .OrderByDescending(x => x.RiskDate)
                .Take(10)
                .ToList();

            /*    model.TopRisk = _context.RiskRegistrations
                   .OrderByDescending(x => x.RiskScore)
                   .Take(10)
                   .ToList(); */

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
                .GroupBy(r => r.InherentRiskRating)
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
        /*  [HttpGet("GetUpcomingDeadlines")]
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
  */
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

        [HttpGet("GetReportFilterOptions")]
        public async Task<IActionResult> GetReportFilterOptions()
        {
            var risks = _context.RiskRegistrations
                .AsNoTracking();


            var result = new
            {
                identifiedRisks = await risks
                    .Where(x => x.IdentifiedRisk != null)
                    .Select(x => x.IdentifiedRisk)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                sourceOfRisks = await risks
                    .Where(x => x.SourceOfRisk != null)
                    .Select(x => x.SourceOfRisk)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                riskCategories = await risks
                    .Where(x => x.RiskCategory != null)
                    .Select(x => x.RiskCategory)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                riskSubCategories = await risks
                    .Where(x => x.RiskSubCategory != null)
                    .Select(x => x.RiskSubCategory)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                riskEvents = await risks
                    .Where(x => x.RiskEvent != null)
                    .Select(x => x.RiskEvent)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                effects = await risks
                    .Where(x => x.Effect != null)
                    .Select(x => x.Effect)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                probabilities = await risks
                    .Where(x => x.Probability != null)
                    .Select(x => x.Probability)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                impactLevels = await risks
                    .Where(x => x.ImpactLevel != null)
                    .Select(x => x.ImpactLevel)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                residualRiskLevels = await risks
                    .Where(x => x.ResidualRiskLevel != null)
                    .Select(x => x.ResidualRiskLevel)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                mitigationRatings = await risks
                    .Where(x => x.MitigationRating != null)
                    .Select(x => x.MitigationRating)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                riskOwners = await risks
                    .Where(x => x.RiskOwner != null)
                    .Select(x => x.RiskOwner)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                registeredBys = await risks
                    .Where(x => x.RegisteredBy != null)
                    .Select(x => x.RegisteredBy)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                branchIds = await risks
                    .Where(x => x.BranchId != null)
                    .Select(x => x.BranchId)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync(),

                branchNames = await risks
                    .Where(x => x.BranchName != null)
                    .Select(x => x.BranchName)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync()
            };


            return Json(result);
        }


        [HttpGet("GetReportData")]
        public async Task<IActionResult> GetReportData(
            string? identifiedRisk,
            string? sourceOfRisk,
            string? riskCategory,
            string? riskSubCategory,
            string? riskEvent,
            string? effect,
            string? probability,
            string? impactLevel,
            string? inherentRiskRating,
            string? residualRiskLevel,
            string? mitigationRating,
            string? riskOwner,
            string? status,
            string? registeredBy,
            string? branchId,
            string? branchName,
            DateTime? fromDate,
            DateTime? toDate)
        {
            var query = _context.RiskRegistrations
                .AsNoTracking()
                .AsQueryable();


            // =========================================================
            // BUSINESS UNIT
            // =========================================================

            if (!string.IsNullOrWhiteSpace(identifiedRisk))
            {
                query = query.Where(x =>
                    x.IdentifiedRisk == identifiedRisk);
            }


            // =========================================================
            // SOURCE OF RISK
            // =========================================================

            if (!string.IsNullOrWhiteSpace(sourceOfRisk))
            {
                query = query.Where(x =>
                    x.SourceOfRisk == sourceOfRisk);
            }


            // =========================================================
            // RISK CATEGORY
            // =========================================================

            if (!string.IsNullOrWhiteSpace(riskCategory))
            {
                query = query.Where(x =>
                    x.RiskCategory == riskCategory);
            }


            // =========================================================
            // RISK SUB CATEGORY
            // =========================================================

            if (!string.IsNullOrWhiteSpace(riskSubCategory))
            {
                query = query.Where(x =>
                    x.RiskSubCategory == riskSubCategory);
            }


            // =========================================================
            // RISK EVENT
            // =========================================================

            if (!string.IsNullOrWhiteSpace(riskEvent))
            {
                query = query.Where(x =>
                    x.RiskEvent == riskEvent);
            }


            // =========================================================
            // EFFECT
            // =========================================================

            if (!string.IsNullOrWhiteSpace(effect))
            {
                query = query.Where(x =>
                    x.Effect == effect);
            }


            // =========================================================
            // PROBABILITY
            // =========================================================

            if (!string.IsNullOrWhiteSpace(probability))
            {
                query = query.Where(x =>
                    x.Probability == probability);
            }


            // =========================================================
            // IMPACT LEVEL
            // =========================================================

            if (!string.IsNullOrWhiteSpace(impactLevel))
            {
                query = query.Where(x =>
                    x.ImpactLevel == impactLevel);
            }


            // =========================================================
            // INHERENT RISK RATING
            // =========================================================

            if (!string.IsNullOrWhiteSpace(inherentRiskRating))
            {
                query = query.Where(x =>
                    x.InherentRiskRating == inherentRiskRating);
            }


            // =========================================================
            // RESIDUAL RISK LEVEL
            // =========================================================

            if (!string.IsNullOrWhiteSpace(residualRiskLevel))
            {
                query = query.Where(x =>
                    x.ResidualRiskLevel == residualRiskLevel);
            }


            // =========================================================
            // MITIGATION RATING
            // =========================================================

            if (!string.IsNullOrWhiteSpace(mitigationRating))
            {
                query = query.Where(x =>
                    x.MitigationRating == mitigationRating);
            }


            // =========================================================
            // RISK OWNER
            // =========================================================

            if (!string.IsNullOrWhiteSpace(riskOwner))
            {
                query = query.Where(x =>
                    x.RiskOwner == riskOwner);
            }


            // =========================================================
            // STATUS
            // =========================================================

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(x =>
                    x.Status == status);
            }


            // =========================================================
            // REGISTERED BY
            // =========================================================

            if (!string.IsNullOrWhiteSpace(registeredBy))
            {
                query = query.Where(x =>
                    x.RegisteredBy == registeredBy);
            }


            // =========================================================
            // BRANCH ID
            // =========================================================

            if (!string.IsNullOrWhiteSpace(branchId))
            {
                query = query.Where(x =>
                    x.BranchId == branchId);
            }


            // =========================================================
            // BRANCH NAME
            // =========================================================

            if (!string.IsNullOrWhiteSpace(branchName))
            {
                query = query.Where(x =>
                    x.BranchName == branchName);
            }


            // =========================================================
            // RISK DATE - FROM
            // =========================================================

            if (fromDate.HasValue)
            {
                var startDate = fromDate.Value.Date;

                query = query.Where(x =>
                    x.RiskDate >= startDate);
            }


            // =========================================================
            // RISK DATE - TO
            // =========================================================

            if (toDate.HasValue)
            {
                var endDate = toDate.Value.Date.AddDays(1);

                query = query.Where(x =>
                    x.RiskDate < endDate);
            }


            // =========================================================
            // EXECUTE QUERY
            // =========================================================

            var risks = await query
                .OrderByDescending(x => x.RegisteredDate)
                .ToListAsync();


            return Json(risks);
        }





    }
}