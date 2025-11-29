using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{

    public required DbSet<Product> Products { get; set; }

    public required DbSet<Basket> Baskets { get; set; } // BasketItem not needed to add here as have relation with Basket!

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole
                {
                    Id = "7b4f937b-731e-4f3c-ac90-ba649419e1b3",
                    Name = "Member",
                    NormalizedName = "MEMBER",
                    ConcurrencyStamp = "11111111-1111-1111-1111-111111111111"
                },
                new IdentityRole
                {
                    Id = "d5418e49-7c53-4009-8480-793a8c6cc424",
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = "22222222-2222-2222-2222-222222222222"
                }
            );

    }
}
