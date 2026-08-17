using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Data;
using RiskManagement.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using RiskManagement.Services;


namespace RiskManagement.Controllers
{
    [Route("Maker")]
    [Authorize(Roles = "Maker")]
    public class MakerController : Controller
    {
        private readonly AppDBContext _context;
        private readonly FileStorageService _fileStorageService;
        public MakerController(AppDBContext context, FileStorageService fileStorageService)
        {
            _context = context;
            _fileStorageService = fileStorageService;
        }
        // private readonly AppDBContext _context;

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
        [HttpGet("IncidentRecord")]
        public IActionResult IncidentRecord()
        {
            return View();
        }

        [HttpPost("createrisk")]
        public async Task<IActionResult> CreateRisk([FromForm] RiskRegistrationDto dto, [FromForm] IFormFile? file)
        {

            Console.WriteLine($"IdentifiedRisk: '{dto.IdentifiedRisk}'");
            Console.WriteLine($"Probability: '{dto.Probability}'");

            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var riskId = await GenerateRiskId(dto.IdentifiedRisk);

            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            string? filePath = null;

            if (file != null)
            {
                filePath = await _fileStorageService.SaveFileAsync(
                    file,
                    "RiskDocuments",
                    true);
            }

            var risk = new RiskRegistration
            {
                RiskId = riskId,
                RiskDate = dto.RiskDate,
                IdentifiedRisk = dto.IdentifiedRisk,
                SourceOfRisk = dto.SourceOfRisk,
                RiskCategory = dto.RiskCategory,
                RiskSubCategory = dto.RiskSubCategory,
                RiskEvent = dto.RiskEvent,

                RiskEventDescription = dto.RiskEventDescription,
                Effect = dto.Effect,
                Probability = dto.Probability,
                ImpactLevel = dto.ImpactLevel,

                InherentRiskRating = dto.InherentRiskRating,
                ResidualRiskLevel = dto.ResidualRiskLevel,
                ExistingRiskMitigation = dto.ExistingRiskMitigation,
                MitigationRating = dto.MitigationRating,
                Recommendation = dto.Recommendation,
                MitigationPlannedDate = dto.MitigationPlannedDate,
                RiskOwner = dto.RiskOwner,
                Status = "pending",
                RegisteredBy = email,   // 👈 secure source
                RegisteredDate = DateTime.UtcNow,
                FilePath = filePath,
                BranchId = "0101",
                BranchName = "Head Office",

            };

            _context.RiskRegistrations.Add(risk);
            await _context.SaveChangesAsync();

            return Ok(risk);
        }

        [HttpPost("createincident")]
        public async Task<IActionResult> CreateIncident(
        [FromBody] IncidentRegistrationDto dto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var incidentId = await GenerateRiskId(dto.IdentifiedRisk);

            var incident = new IncidentRegistration
            {
                // =========================
                // Incident Information
                // =========================

                IncidentId = incidentId,

                IdentifiedRisk = dto.IdentifiedRisk,

                IncidentName = dto.IncidentName,

                IncidentOwner = dto.IncidentOwner,

                EventOccurredDate = dto.EventOccurredDate,

                EventEndedDate = dto.EventEndedDate,

                Priority = dto.Priority,

                SourceOfIncident = dto.SourceOfIncident,

                EventDescription = dto.EventDescription,

                EventType = dto.EventType,

                BusinessLine = dto.BusinessLine,

                BusinessActivity = dto.BusinessActivity,


                // =========================
                // Impact Parameters
                // =========================

                LossType = dto.LossType,

                LossDate = dto.LossDate,

                Insurance = dto.Insurance,

                LossAmount = dto.LossAmount,

                RecoveryAmount = dto.RecoveryAmount,

                // Calculate on the server
                NetLossAmount = (dto.LossAmount ?? 0) - (dto.RecoveryAmount ?? 0),


                // =========================
                // Mitigation
                // =========================

                MitigationAction = dto.MitigationAction,

                ActionType = dto.ActionType,

                ResponsiblePerson = dto.ResponsiblePerson,

                MitigationDescription = dto.MitigationDescription,

                MitigationStartDate = dto.MitigationStartDate,

                MitigationEndDate = dto.MitigationEndDate,


                // =========================
                // Status
                // =========================

                Status = dto.Status,


                // =========================
                // Registration Information
                // =========================

                RegisteredBy = email,

                RegisteredDate = DateTime.UtcNow,

                BranchId = "0101",

                BranchName = "Head Office",

                ApprovedBy = null,

                ApprovedDate = null
            };

            _context.IncidentRecords.Add(incident);

            await _context.SaveChangesAsync();

            return Ok(incident);
        }



        [HttpPost("editrisk")]
        public IActionResult Updaterisk([FromBody] RiskRegistration model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid input", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
            }

            var risk = _context.RiskRegistrations.FirstOrDefault(a => a.RiskId == model.RiskId);
            if (risk == null)
            {
                return NotFound(new { message = "Record with this Risk ID not found" });
            }

            risk.RiskDate = model.RiskDate;
            risk.SourceOfRisk = model.SourceOfRisk;
            risk.RiskCategory = model.RiskCategory;
            risk.RiskEventDescription = model.RiskEventDescription;

            // SECTION 2: RISK ASSESSMENT
            risk.Effect = model.Effect;
            risk.Probability = model.Probability;
            risk.ImpactLevel = model.ImpactLevel;
            /*  risk.RiskScore = model.RiskScore;
             risk.RiskRating = model.RiskRating; */
            risk.ResidualRiskLevel = model.ResidualRiskLevel;

            // SECTION 3: MITIGATION & CONTROLS
            risk.ExistingRiskMitigation = model.ExistingRiskMitigation;
            risk.MitigationRating = model.MitigationRating;
            risk.Recommendation = model.Recommendation;

            // SECTION 4: OWNERSHIP & PLANNING
            risk.MitigationPlannedDate = model.MitigationPlannedDate;
            risk.RiskOwner = model.RiskOwner;
            risk.Status = "pending";
            _context.SaveChanges();

            return Ok(new { StatusCode = 200, success = true, message = "Status updated successfully", data = risk });
        }

        [HttpGet("RejectedRecords")]
        public IActionResult RejectedRecords()
        {


            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            var filteredUsers = _context.RiskRegistrations
                .Where(u => u.RegisteredBy == email && u.Status == "rejected")
                .OrderByDescending(u => u.Id)
                .ToList();

            // Extract the queue numbers from filtered users
            var riskIds = filteredUsers
                .Select(f => f.RiskId)
                .ToList();

            // Get the latest rejection per queue number
            var latestRejections = _context.RejectedRisks
                .Where(r => riskIds.Contains(r.RiskId))
                .GroupBy(r => r.RiskId)
                .Select(g => g.OrderByDescending(r => r.Id).FirstOrDefault())
                .ToDictionary(r => r.RiskId, r => r); // Convert to Dictionary for easy access

            // Build the view model
            var viewModel = new MergeDB
            {
                UserData = filteredUsers,
                RejectedInfoMap = latestRejections
            };

            return View("Rejected", viewModel);
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