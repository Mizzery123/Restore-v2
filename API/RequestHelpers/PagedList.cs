using System;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers;

public class PagedList<T> : List<T> // Product
{
    public PagedList(List<T> items, int count, int pageNumber, int pageSize)
    {
        Metadata = new PaginationMetadata
        {
            TotalCount = count,
            PageSize = pageSize,
            CurrentPage = pageNumber,
            TotalPages = (int)Math.Ceiling(count / (double)pageSize) //Ceiling rounds up to nearest whole number
        };
        AddRange(items); //An in built function to add to end of list
    }

    public PaginationMetadata Metadata { get; set; }

    public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
    {
        var count = await query.CountAsync(); //Gets total number of items in full query 
        
        // Skip(...) jumps past the items from previous pages. 
        // Take(pageSize) grabs only the items for the current page. 
        // ToListAsync() turns those items into a list.
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}
