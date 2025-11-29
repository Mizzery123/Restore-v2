using System;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Address // 1 to 1 rs with user and address
{

    [JsonIgnore] //Do not send Id back as part of json response!
    public int Id {get; set; }

    public required string Name {get; set; }

    public required string Line1 {get; set; }

    public string? Line2 { get; set; }

    public required string City { get; set; }

    public required string State { get; set; }

    [JsonPropertyName("postal_code")] //Use this as property name
    public required string PostalCode { get; set; }

    public required string Country { get; set; }
    

}
