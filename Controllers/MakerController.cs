using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Data;
using RiskManagement.Models;
using System.Security.Claims;


namespace RiskManagement.Controllers
{
    [Authorize(Roles = "Maker")]
    public class MakerController : Controller
    {
        public MakerController(AppDBContext context) => _context = context;
        private readonly AppDBContext _context;
        public IActionResult Dashboard()
        {
            return View();
        }
        public IActionResult Register()
        {
            return View();
        }



        [HttpPost ("createrisk")]
        public async Task<IActionResult> CreateRisk([FromBody] RiskRegistrationDto dto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var risk = new RiskRegistration
            {
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
    }
}