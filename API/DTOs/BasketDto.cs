// Shaping the json data sent from API to frontend, helps control what data to send to frontend
using System;

namespace API.DTOs;

public class BasketDto
{
    public required string BasketId { get; set; }

    public List<BasketItemDto> Items { get; set; } = []; //Needs data from another DTO!
}
