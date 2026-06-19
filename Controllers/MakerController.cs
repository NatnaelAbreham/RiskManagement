using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RiskManagement.Controllers
{
    [Authorize(Roles = "Maker")]
    public class MakerController : Controller
    {
        public IActionResult Dashboard()
        {
            return View();
        }
    }
}