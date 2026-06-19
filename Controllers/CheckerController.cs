using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RiskManagement.Controllers
{
    [Authorize(Roles = "Checker")]
    public class CheckerController : Controller
    {
        public IActionResult Dashboard()
        {
            return View();
        }
    }
}