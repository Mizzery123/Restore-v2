
import { createApi } from "@reduxjs/toolkit/query/react"; //This createAPI import must be from REACT at the end, don't use the other one!
import type { Product } from "../../app/models/product"; //Add 'type' if verbatimModuleSyntax error
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import type { ProductParams } from "../../app/models/productParams";
import { filterEmptyValues } from "../../lib/util";
import type { Pagination } from "../../app/models/pagination";

export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchProducts: builder.query<{items: Product[], pagination: Pagination}, ProductParams>({
            query: (productParams) => {
                return {
                    url: 'products',
                    params: filterEmptyValues(productParams)
                }
            },
            transformResponse: (items: Product[], meta) => {
                const paginationHeader = meta?.response?.headers.get('Pagination');
                const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
                return {items, pagination};
            }
        }),

        fetchProductDetails: builder.query<Product, number>({
            query: (productId) => `products/${productId}`
        }),
        fetchFilters: builder.query<{brands: string[], types: string[]}, void>({
            query: () => 'products/filters'
        })
    })
});

export const {useFetchProductDetailsQuery, useFetchProductsQuery, useFetchFiltersQuery} = catalogApi