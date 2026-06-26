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