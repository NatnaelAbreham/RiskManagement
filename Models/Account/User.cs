using System;
using System.ComponentModel.DataAnnotations;

namespace RiskManagement.Account.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        [Required]
        public string Status { get; set; } = "1";

        [Required]
        public string Role { get; set; } = "124451";
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}