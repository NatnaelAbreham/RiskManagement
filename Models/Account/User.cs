using System;
using System.ComponentModel.DataAnnotations;

namespace RiskManagement.Account.Models
{
    public class User
    {
         public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [StringLength(256)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [StringLength(30)]
        public string? Phone { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "1";

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = "124451";

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}