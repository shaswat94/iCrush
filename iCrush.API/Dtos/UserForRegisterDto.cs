using System;
using System.ComponentModel.DataAnnotations;

namespace iCrush.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(12, MinimumLength=4, ErrorMessage="You must specify password between 4 and 12 characters")]
        public string  Password { get; set; }
        public string Gender { get; set; }
        
        [Required]
        public string KnownAs { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Country { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastActive { get; set; }

        public UserForRegisterDto()
        {
            CreatedDate = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}