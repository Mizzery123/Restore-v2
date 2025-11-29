using System;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;
//Extends on IdentityUser class which provides Id, username, passwordhash etc.
public class User : IdentityUser
{
    public int? AddressId {get; set;}
    
    public Address? Address {get; set;} //Optional as user can choose when to enter
}
