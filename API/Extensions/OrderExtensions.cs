// To convert order entities from database into OrderDto objects to return to client
using System;
using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class OrderExtensions
{
    public static IQueryable<OrderDto> ProjectToDto(this IQueryable<Order> query) // For shaping retrieve order's return json data
    {
        return query.Select(order => new OrderDto
        {
            Id = order.Id,
            BuyerEmail = order.BuyerEmail,
            OrderDate = order.OrderDate,
            ShippingAddress = order.ShippingAddress,
            PaymentSummary = order.PaymentSummary,
            DeliveryFee = order.DeliveryFee,
            Subtotal = order.Subtotal,
            OrderStatus = order.OrderStatus.ToString(),
            Total = order.GetTotal(),
            OrderItems = order.OrderItems.Select(item => new OrderItemDto
            {
                ProductId = item.ItemOrdered.ProductId,
                Name = item.ItemOrdered.Name,
                PictureUrl = item.ItemOrdered.PictureUrl,
                Price = item.Price,
                Quantity = item.Quantity
            }).ToList()
        }).AsNoTracking(); //Needed if there is tracking error
    }

    public static OrderDto ToDto(this Order order) //For shaping creation of order's returned json data
    {
        return new OrderDto
        {
            Id = order.Id,
            BuyerEmail = order.BuyerEmail,
            OrderDate = order.OrderDate,
            ShippingAddress = order.ShippingAddress,
            PaymentSummary = order.PaymentSummary,
            DeliveryFee = order.DeliveryFee,
            Subtotal = order.Subtotal,
            OrderStatus = order.OrderStatus.ToString(),
            Total = order.GetTotal(),
            OrderItems = order.OrderItems.Select(item => new OrderItemDto
            {
                ProductId = item.ItemOrdered.ProductId,
                Name = item.ItemOrdered.Name,
                PictureUrl = item.ItemOrdered.PictureUrl,
                Price = item.Price,
                Quantity = item.Quantity
            }).ToList()
        };
    }
}
