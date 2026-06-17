using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using RiskManagement.Models;

namespace RiskManagement.Controllers
{
    public class AccountController : Controller
    {

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }
    }
}