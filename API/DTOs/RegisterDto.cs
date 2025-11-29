// Shape the data your API expects when creating a new user (email + password)
using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required] //data annotation (ASP.NET runtime validation, must include in incoming api request)
    public string Email { get; set;} = string.Empty; 

    public required string Password { get; set; }

}
