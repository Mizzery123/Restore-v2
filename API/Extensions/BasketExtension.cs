using System;
using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class BasketExtension
{
    public static BasketDto ToDto(this Basket basket) // basket.ToDto() - A helper method for Basket class to avoid repetition
    {
        return new BasketDto
        {
            BasketId = basket.BasketId,
            Items = basket.Items.Select(x => new BasketItemDto
            {
                ProductId = x.ProductId,
                Name = x.Product.Name,
                Price = x.Product.Price,
                Brand = x.Product.Brand,
                Type = x.Product.Type,
                PictureUrl = x.Product.PictureUrl,
                Quantity = x.Quantity
            }).ToList()
        };
    }
}
