using System;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController(StoreContext context) : BaseApiController //Also need to inject store context in the controller!
{
    [HttpGet] //Define an api endpoint!
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await RetrieveBasket();

        if (basket == null) return NoContent();

        return basket.ToDto();
    }

    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity) //Does not need to return anything
    {
        //get basket
        var basket = await RetrieveBasket();
        //create basket
        basket ??= CreateBasket(); //Check if basket is null, if null will assign the method
        //get product   
        var product = await context.Products.FindAsync(productId);
        if (product == null) return BadRequest("Problem adding item to basket");
        //add item to basket
        basket.AddItem(product, quantity);
        //save changes
        var result = await context.SaveChangesAsync() > 0; //Check if something is changed in db, if changed will be > 0 and return true

        if (result) return CreatedAtAction(nameof(GetBasket), basket.ToDto()); //Returns basket

        return BadRequest("Problem updating basket");
    }



    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
        //get basket
        var basket = await RetrieveBasket();
        //remove item or reduce quantity
        if (basket == null) return BadRequest("Unable to retrieve basket");
        basket.RemoveItem(productId, quantity);
        
        //save changes
        var result = await context.SaveChangesAsync() > 0; //Check if something is changed in db, if changed will be > 0 and return true
        if (result) return Ok();

        return BadRequest("Problem updating basket");
    }


    private async Task<Basket?> RetrieveBasket() //? means can return null for this method
    {
        return await context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.BasketId == Request.Cookies["basketId"]);
    }

    private Basket CreateBasket() // Ensure there is no ? after Basket as if called, must create a basket!
    {
        var basketId = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.UtcNow.AddDays(30) //Days to survive in user browser
        };
        Response.Cookies.Append("basketId", basketId, cookieOptions);
        var basket = new Basket {BasketId = basketId};
        context.Baskets.Add(basket);
        return basket;
    }
}