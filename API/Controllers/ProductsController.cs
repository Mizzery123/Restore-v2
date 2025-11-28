// handles API calls to get all products or a single product from the database.

using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class ProductsController(StoreContext context) : BaseApiController
    {

        [HttpGet]
        //Async can handle more requests with await
        public async Task<ActionResult<List<Product>>> 
        GetProducts([FromQuery]ProductParams productParams) // [FromQuery] hints to API controller to look for info in query string
        {
            var query = context.Products
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types)
            .AsQueryable(); //Using sort and search extension

            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize); //order is impt!

            Response.AddPaginationHeader(products.Metadata);
            return products; // Makes query request to db
        }

        [HttpGet("{id}")] //api/products/2
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id);

            if (product == null) return NotFound();

            return product;
        }

        //returns all the unique brands and unique types from the products in the database.
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await context.Products.Select (x => x.Brand).Distinct().ToListAsync(); //Distinct shows unique values
            var types = await context.Products.Select (x => x.Type).Distinct().ToListAsync();

            return Ok( new {brands, types});
        }
    }
}
