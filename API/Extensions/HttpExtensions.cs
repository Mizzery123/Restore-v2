using System;
using System.Text.Json;
using API.RequestHelpers;
using Microsoft.Net.Http.Headers;

namespace API.Extensions;

// adds a Pagination header to an HTTP response
public static class HttpExtensions
{
    public static void AddPaginationHeader(this HttpResponse response, PaginationMetadata metadata)
    {
        var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

        response.Headers.Append("Pagination", JsonSerializer.Serialize(metadata, options));
        response.Headers.Append(HeaderNames.AccessControlExposeHeaders, "Pagination");
    }
}
