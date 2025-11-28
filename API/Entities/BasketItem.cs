// Defines one entry in the shopping basket
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("BasketItems")] // Data annotation to modify Table name to be BasketItems instead of BasketItem!
public class BasketItem
{
    public int Id { get; set;}
    public int Quantity { get; set; }

    //navigation properties
    public int ProductId { get; set; }

    public required Product Product {get; set; }

    public int BasketId { get; set; } // Written to ensure BasketId is never null by declaring it as int!
    public Basket Basket { get; set; } = null!; //Comes in pair with above ^
    // Cannot use required as will cause error in Basket.cs to require basket ID for basketItem!
}