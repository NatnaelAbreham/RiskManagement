using System;
using System.ComponentModel.DataAnnotations;

namespace RiskManagement.Account.Models
{
    public class CreateUserDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string? Status { get; set; }
        public string? Role { get; set; }
    }
}