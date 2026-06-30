using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Data;
using RiskManagement.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;


namespace RiskManagement.Controllers
{
    [Route("Maker")]
    [Authorize(Roles = "Maker")]
    public class MakerController : Controller
    {
        public MakerController(AppDBContext context) => _context = context;
        private readonly AppDBContext _context;

        [HttpGet("View")]
        public IActionResult ViewRecord()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var filteredUsers = _context.RiskRegistrations
          .Where(u => u.RegisteredBy == email)
          .OrderByDescending(u => u.Id)
          .ToList();


            return View("View", filteredUsers);
        }

        [HttpGet("Dashboard")]
        public IActionResult Dashboard()
        {
            return View();
        }

        [HttpGet("Register")]
        public IActionResult Register()
        {
            return View();
        }

        [HttpGet("Profile")]
        public IActionResult Profile()
        {
            return View();
        }

        [HttpPost("createrisk")]
        public async Task<IActionResult> CreateRisk([FromBody] RiskRegistrationDto dto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var riskId = await GenerateRiskId(dto.IdentifiedRisk);

            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var risk = new RiskRegistration
            {
                RiskId = riskId,
                RiskDate = dto.RiskDate,
                IdentifiedRisk = dto.IdentifiedRisk,
                SourceOfRisk = dto.SourceOfRisk,
                RiskCategory = dto.RiskCategory,
                RiskEventDescription = dto.RiskEventDescription,
                Effect = dto.Effect,
                Probability = dto.Probability,
                ImpactLevel = dto.ImpactLevel,
                RiskScore = dto.RiskScore,
                RiskRating = dto.RiskRating,
                ResidualRiskLevel = dto.ResidualRiskLevel,
                ExistingRiskMitigation = dto.ExistingRiskMitigation,
                MitigationRating = dto.MitigationRating,
                Recommendation = dto.Recommendation,
                MitigationPlannedDate = dto.MitigationPlannedDate,
                RiskOwner = dto.RiskOwner,
                Status = "pending",
                RegisteredBy = email,   // 👈 secure source
                RegisteredDate = DateTime.UtcNow
            };

            _context.RiskRegistrations.Add(risk);
            await _context.SaveChangesAsync();

            return Ok(risk);
        }
        [HttpPost("updaterisk")]
        public IActionResult Updaterisk([FromBody] RiskRegistration model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid input", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
            }

            var risk = _context.RiskRegistrations.FirstOrDefault(a => a.RiskId == model.RiskId);
            if (risk == null)
            {
                return NotFound(new { message = "Record with this queue number not found" });
            }

            risk.RiskDate = model.RiskDate;
            risk.SourceOfRisk = model.SourceOfRisk;
            risk.RiskCategory = model.RiskCategory;
            risk.RiskEventDescription = model.RiskEventDescription;

            // SECTION 2: RISK ASSESSMENT
            risk.Effect = model.Effect;
            risk.Probability = model.Probability;
            risk.ImpactLevel = model.ImpactLevel;
            risk.RiskScore = model.RiskScore;
            risk.RiskRating = model.RiskRating;
            risk.ResidualRiskLevel = model.ResidualRiskLevel;

            // SECTION 3: MITIGATION & CONTROLS
            risk.ExistingRiskMitigation = model.ExistingRiskMitigation;
            risk.MitigationRating = model.MitigationRating;
            risk.Recommendation = model.Recommendation;

            // SECTION 4: OWNERSHIP & PLANNING
            risk.MitigationPlannedDate = model.MitigationPlannedDate;
            risk.RiskOwner = model.RiskOwner;
            risk.Status = model.Status;
            _context.SaveChanges();

            return Ok(new { StatusCode = 200, success = true, message = "Status updated successfully", data = fcy });
        }
        private string GetRiskPrefix(string identifiedRisk)
        {
            return identifiedRisk switch
            {
                "DomesticBanking" => "DB",
                "CreditOperation" => "CO",
                "InternationalBanking" => "IB",
                "InvestmentPortfolio" => "IP",
                "ComplianceRegulatory" => "CR",
                _ => throw new Exception("Unknown risk type")
            };
        }
        private async Task<string> GenerateRiskId(string identifiedRisk)
        {
            var prefix = GetRiskPrefix(identifiedRisk);

            var sequence = await _context.RiskSequences
                .FirstOrDefaultAsync(x => x.Prefix == prefix);

            if (sequence == null)
                throw new Exception($"Sequence not found for {prefix}");

            sequence.LastNumber++;

            await _context.SaveChangesAsync();

            return $"{prefix}{sequence.LastNumber:D6}";
        }
    }
}