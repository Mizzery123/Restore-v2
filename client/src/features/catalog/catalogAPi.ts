
import { createApi } from "@reduxjs/toolkit/query/react"; //This createAPI import must be from REACT at the end, don't use the other one!
import type { Product } from "../../app/models/product"; //Add 'type' if verbatimModuleSyntax error
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchProducts: builder.query<Product[], void> ({
            query: () => ({url: 'products'})
        }),

        fetchProductDetails: builder.query<Product, number>({
            query: (productId) => `products/${productId}`
        })
    })
});

export const {useFetchProductDetailsQuery, useFetchProductsQuery} = catalogApi