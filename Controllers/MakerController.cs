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
                Status = "Open",
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
                _ => "RK"
            };
        }

        private async Task<string> GenerateRiskId(string identifiedRisk)
        {
            var prefix = GetRiskPrefix(identifiedRisk);

            var lastRisk = await _context.RiskRegistrations
                .Where(r => r.RiskId.StartsWith(prefix))
                .OrderByDescending(r => r.RiskId)
                .FirstOrDefaultAsync();

            int nextNumber = 1;

            if (lastRisk != null)
            {
                var numericPart = lastRisk.RiskId.Substring(2);

                if (int.TryParse(numericPart, out int currentNumber))
                {
                    nextNumber = currentNumber + 1;
                }
            }

            return $"{prefix}{nextNumber:D6}";
        }
    }
}