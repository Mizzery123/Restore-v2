using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : DbContext(options)
{
    
    public required DbSet<Product> Products { get; set; }

    public required DbSet<Basket> Baskets { get; set; } // BasketItem not needed to add here as have relation with Basket!
}
