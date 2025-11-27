using API.Data;
using API.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(); //Prevent cors policy error
builder.Services.AddTransient<ExceptionMiddleware>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi(); //Not covered

var app = builder.Build();

// Configure the HTTP request pipeline. (AKA Middleware - Receive HTTP requests and return responses)
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

//app.UseHttpsRedirection(); // Not used

//app.UseAuthorization(); // Not used

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors( opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://localhost:3000"); //allowcredentials to send up cookies!
});

app.MapControllers();

DbInitializer.InitDb(app);

app.Run();
