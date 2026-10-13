using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Data;
using RiskManagement.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;
using System.Text.RegularExpressions;

namespace RiskManagement.Controllers
{
    [Route("Checker")]
    [Authorize(Roles = "Checker")]
    public class CheckerController : Controller
    {

        private readonly AppDBContext _context;
        private readonly IWebHostEnvironment _environment;
        public CheckerController(AppDBContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

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

            //total incident
            model.TotalIncident = _context.IncidentRecords.Count();

            model.OpenRisk = _context.IncidentRecords
                .Count(x => x.Status == "In Progress");

            model.ClosedRisk = _context.IncidentRecords
                .Count(x => x.Status == "Closed");

            model.HighRisk = _context.RiskRegistrations
                .Count(x => x.InherentRiskRating == "High" || x.InherentRiskRating == "Very High");

            model.DueSoon = _context.RiskRegistrations
                .Count(x => x.MitigationPlannedDate <= DateTime.Today.AddDays(7));

            model.RecentRisks = _context.RiskRegistrations
                .OrderByDescending(x => x.RiskDate)
                .Take(10)
                .ToList();

            model.TopRisk = _context.RiskRegistrations
    .AsEnumerable()
    .OrderByDescending(x => x.InherentRiskRating switch
    {
        "Very High" => 5,
        "High" => 4,
        "Moderate" => 3,
        "Low" => 2,
        "Very Low" => 1,
        _ => 0
    })
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
        [HttpGet("GetUpcomingDeadlines")]
        public JsonResult GetUpcomingDeadlines()
        {
            var today = DateTime.Today;
            var next30Days = today.AddDays(30);

            var data = _context.RiskRegistrations
                .Where(r => r.MitigationPlannedDate.HasValue &&
                            r.MitigationPlannedDate.Value >= today &&
                            r.MitigationPlannedDate.Value <= next30Days)
                .GroupBy(r => r.MitigationPlannedDate.Value.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToList()
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
                    .ToListAsync(),
                inherentRiskRatings = await risks
    .Where(x => x.InherentRiskRating != null)
    .Select(x => x.InherentRiskRating)
    .Distinct()
    .OrderBy(x => x)
    .ToListAsync(),

                statuses = await risks
    .Where(x => x.Status != null)
    .Select(x => x.Status)
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



        [HttpGet("ExportRiskRegister")]
        public async Task<IActionResult> ExportRiskRegister(
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

            if (!string.IsNullOrWhiteSpace(identifiedRisk))
                query = query.Where(x => x.IdentifiedRisk == identifiedRisk);

            if (!string.IsNullOrWhiteSpace(sourceOfRisk))
                query = query.Where(x => x.SourceOfRisk == sourceOfRisk);

            if (!string.IsNullOrWhiteSpace(riskCategory))
                query = query.Where(x => x.RiskCategory == riskCategory);

            if (!string.IsNullOrWhiteSpace(riskSubCategory))
                query = query.Where(x => x.RiskSubCategory == riskSubCategory);

            if (!string.IsNullOrWhiteSpace(riskEvent))
                query = query.Where(x => x.RiskEvent == riskEvent);

            if (!string.IsNullOrWhiteSpace(effect))
                query = query.Where(x => x.Effect == effect);

            if (!string.IsNullOrWhiteSpace(probability))
                query = query.Where(x => x.Probability == probability);

            if (!string.IsNullOrWhiteSpace(impactLevel))
                query = query.Where(x => x.ImpactLevel == impactLevel);

            if (!string.IsNullOrWhiteSpace(inherentRiskRating))
                query = query.Where(x => x.InherentRiskRating == inherentRiskRating);

            if (!string.IsNullOrWhiteSpace(residualRiskLevel))
                query = query.Where(x => x.ResidualRiskLevel == residualRiskLevel);

            if (!string.IsNullOrWhiteSpace(mitigationRating))
                query = query.Where(x => x.MitigationRating == mitigationRating);

            if (!string.IsNullOrWhiteSpace(riskOwner))
                query = query.Where(x => x.RiskOwner == riskOwner);

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(x => x.Status == status);

            if (!string.IsNullOrWhiteSpace(registeredBy))
                query = query.Where(x => x.RegisteredBy == registeredBy);

            if (!string.IsNullOrWhiteSpace(branchId))
                query = query.Where(x => x.BranchId == branchId);

            if (!string.IsNullOrWhiteSpace(branchName))
                query = query.Where(x => x.BranchName == branchName);

            if (fromDate.HasValue)
            {
                var startDate = fromDate.Value.Date;
                query = query.Where(x => x.RiskDate >= startDate);
            }

            if (toDate.HasValue)
            {
                var endDate = toDate.Value.Date.AddDays(1);
                query = query.Where(x => x.RiskDate < endDate);
            }

            var risks = await query
                .OrderByDescending(x => x.RegisteredDate)
                .ToListAsync();

            var templatePath = Path.Combine(
                _environment.WebRootPath,
                "templates",
                "A Risk Register Standared (1).xlsx");

            if (!System.IO.File.Exists(templatePath))
                return Problem("The Risk Register Excel template was not found.");

            using var workbook = new XLWorkbook(templatePath);

            // Keep the two original worksheets and their formatting.
            // Add a copy of the template only when another business unit
            // exists in the filtered results.
            var groups = risks
                .GroupBy(
                    x => string.IsNullOrWhiteSpace(x.IdentifiedRisk)
                        ? "Other Risks"
                        : x.IdentifiedRisk.Trim(),
                    StringComparer.OrdinalIgnoreCase)
                .ToList();

            var sheetNames = new Dictionary<string, string>(
                StringComparer.OrdinalIgnoreCase)
            {
                ["DomesticBanking"] = "Domestic Banking",
                ["CreditOperation"] = "Credit"
            };

            foreach (var group in groups)
            {
                if (sheetNames.ContainsKey(group.Key))
                    continue;

                var displayName = group.Key switch
                {
                    "InternationalBanking" => "International Banking",
                    "InvestmentPortfolio" => "Investment Portfolio",
                    "ComplianceRegulatory" => "Compliance Regulatory",
                    "Other Risks" => "Other Risks",
                    _ => group.Key
                };

                var baseName = Regex.Replace(
                    displayName, @"[\[\]:*?/\\]", " ").Trim();

                if (string.IsNullOrWhiteSpace(baseName))
                    baseName = "Other Risks";

                baseName = baseName.Length > 31
                    ? baseName[..31]
                    : baseName;

                var sheetName = baseName;
                var suffix = 2;

                while (workbook.Worksheets.Any(
                    ws => ws.Name.Equals(
                        sheetName, StringComparison.OrdinalIgnoreCase)))
                {
                    var ending = $" ({suffix++})";
                    sheetName = baseName[..Math.Min(
                        baseName.Length, 31 - ending.Length)] + ending;
                }

                // Copy the original template sheet to preserve its styling
                // and risk matrix.
                workbook.Worksheet("Domestic Banking").CopyTo(sheetName);
                sheetNames[group.Key] = sheetName;
            }

            foreach (var group in groups)
            {
                var sheetName = sheetNames[group.Key];
                var ws = workbook.Worksheet(sheetName);

                ws.Cell("A2").Value =
                    $"Risk Register for {group.Key switch
                    {
                        "DomesticBanking" => "Domestic Banking Operation",
                        "CreditOperation" => "Credit Operation",
                        "InternationalBanking" => "International Banking",
                        "InvestmentPortfolio" => "Investment Portfolio",
                        "ComplianceRegulatory" => "Compliance & Regulatory",
                        _ => group.Key
                    }}";

                ws.Cell("A3").Value =
                    $"Date Created: {DateTime.Now:dd MMM yyyy}";

                // Clear example records only. The matrices to the right
                // of column P remain untouched.
                ws.Range("A7:P1000").Clear(XLClearOptions.Contents);

                var row = 7;
                var templateStyleRow = 7;

                foreach (var risk in group)
                {
                    // Copy the original data-row style for each output row.
                    if (row != templateStyleRow)
                    {
                        for (var col = 1; col <= 16; col++)
                        {
                            ws.Cell(row, col).Style =
                                ws.Cell(templateStyleRow, col).Style;
                        }

                        ws.Row(row).Height = ws.Row(templateStyleRow).Height;
                    }

                    ws.Cell(row, 1).Value = row - 6;
                    ws.Cell(row, 2).Value = risk.RiskDate;
                    ws.Cell(row, 3).Value = risk.RiskId;
                    ws.Cell(row, 4).Value = risk.RiskEvent;
                    ws.Cell(row, 5).Value = risk.RiskCategory;
                    ws.Cell(row, 6).Value = risk.SourceOfRisk;
                    ws.Cell(row, 7).Value = risk.Effect;
                    ws.Cell(row, 8).Value = risk.Probability;
                    ws.Cell(row, 9).Value = risk.ImpactLevel;

                    var probabilityScore = GetRiskScaleScore(risk.Probability);
                    var impactScore = GetRiskScaleScore(risk.ImpactLevel);

                    if (probabilityScore.HasValue && impactScore.HasValue)
                    {
                        var score = probabilityScore.Value * impactScore.Value;
                        ws.Cell(row, 10).Value = score;
                        ApplyRiskCellColor(ws.Cell(row, 10), GetRatingFromScore(score));
                    }

                    ws.Cell(row, 11).Value = risk.ExistingRiskMitigation;
                    ws.Cell(row, 12).Value = risk.MitigationRating;
                    ws.Cell(row, 13).Value = risk.ResidualRiskLevel ?? "";
                    ws.Cell(row, 14).Value = risk.Recommendation ?? "";
                    ws.Cell(row, 15).Value = risk.RiskOwner;

                    if (risk.MitigationPlannedDate.HasValue)
                    {
                        ws.Cell(row, 16).Value =
                            risk.MitigationPlannedDate.Value;

                        ws.Cell(row, 16).Style.DateFormat.Format =
                            "dd-MMM-yyyy";
                    }

                    ApplyRiskCellColor(
                        ws.Cell(row, 13), risk.ResidualRiskLevel);

                    ws.Cell(row, 2).Style.DateFormat.Format = "dd-MMM-yyyy";

                    // Wrap long descriptions and mitigation text.
                    for (var col = 4; col <= 15; col++)
                        ws.Cell(row, col).Style.Alignment.WrapText = true;

                    row++;
                }

                ws.SheetView.FreezeRows(6);
                ws.PageSetup.PageOrientation = XLPageOrientation.Landscape;
                ws.PageSetup.FitToPages(1, 0);
                ws.PageSetup.PagesWide = 1;
                ws.PageSetup.CenterHorizontally = true;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            return File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"Risk_Register_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx");
        }

        private static int? GetRiskScaleScore(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            var match = Regex.Match(value, @"\(([1-5])\)");

            if (match.Success)
                return int.Parse(match.Groups[1].Value);

            var normalized = Regex.Replace(
                value.ToLowerInvariant(), @"[\s_\-&]", "");

            if (normalized.Contains("almostcertain") ||
                normalized.Contains("veryhigh"))
                return 5;

            if (normalized.Contains("unlikely"))
                return 2;

            if (normalized.Contains("likely"))
                return 4;

            if (normalized.Contains("possible") ||
                normalized.Contains("medium"))
                return 3;

            if (normalized.Contains("rare") ||
                normalized.Contains("verylow"))
                return 1;

            if (normalized == "low")
                return 2;

            if (normalized == "high")
                return 4;

            return null;
        }
        private static string GetRatingFromScore(int score)
        {
            return score switch
            {
                <= 1 => "Very Low",
                <= 4 => "Low",
                <= 9 => "Moderate",
                <= 15 => "High",
                _ => "Very High"
            };
        }

        private static void ApplyRiskCellColor(
            IXLCell cell, string? rating)
        {
            var normalized = (rating ?? "").Trim().ToLowerInvariant();

            var color = normalized switch
            {
                "very low" => "#C6E0B4",
                "low" => "#A9D18E",
                "moderate" or "medium" => "#FFE699",
                "high" => "#F4B183",
                "very high" or "extreme" => "#F4CCCC",
                _ => null
            };

            if (color != null)
            {
                cell.Style.Fill.BackgroundColor = XLColor.FromHtml(color);
                cell.Style.Font.FontColor = XLColor.Black;
            }
        }


    }
}