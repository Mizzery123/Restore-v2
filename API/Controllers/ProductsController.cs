// handles API calls to get all products or a single product from the database.

using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class ProductsController(StoreContext context, IMapper mapper, ImageService imageService) : BaseApiController
    {

        [HttpGet]
        //Async can handle more requests with await
        public async Task<ActionResult<List<Product>>>
        GetProducts([FromQuery] ProductParams productParams) // [FromQuery] hints to API controller to look for info in query string
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
            var brands = await context.Products.Select(x => x.Brand).Distinct().ToListAsync(); //Distinct shows unique values
            var types = await context.Products.Select(x => x.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
        {
            var product = mapper.Map<Product>(productDto); //Mapping properties of Product class with productDto

            if (productDto.File != null) //Uploading of image
            {
                var imageResult = await imageService.AddImageAsync(productDto.File);

                if (imageResult.Error != null)
                {
                    return BadRequest(imageResult.Error.Message);
                }

                product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
                product.PublicId = imageResult.PublicId;
            }

            context.Products.Add(product);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return CreatedAtAction(nameof(GetProduct), new { Id = product.Id }, product);

            return BadRequest("Problem creating new product");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateProduct(UpdateProductDto updateProductDto)
        {
            var product = await context.Products.FindAsync(updateProductDto.Id);

            if (product == null) return NotFound();

            mapper.Map(updateProductDto, product);

            if (updateProductDto.File != null)
            {
                var imageResult = await imageService.AddImageAsync(updateProductDto.File);

                if (imageResult.Error != null) return BadRequest(imageResult.Error.Message);

                if (!string.IsNullOrEmpty(product.PublicId))
                {
                    await imageService.DeleteImageAsync(product.PublicId);
                }

                product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
                product.PublicId = imageResult.PublicId;
            }

            var result = await context.SaveChangesAsync() > 0;

            if (result) return NoContent();

            return BadRequest("Problem updating product");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await context.Products.FindAsync(id);

            if (product == null) return NotFound();

            if (!string.IsNullOrEmpty(product.PublicId))
            {
                await imageService.DeleteImageAsync(product.PublicId);
            }

            context.Products.Remove(product);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("Problem deleting the product");
        }
    }
}
