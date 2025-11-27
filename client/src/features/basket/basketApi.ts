import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Item, type Basket } from "../../app/models/basket";
import type { Product } from "../../app/models/product";

function isBasketItem(product: Product | Item): product is Item{
    return (product as Item).quantity !== undefined; //If a basket item, will have quantity property. If product, will be undefined
}

export const basketApi = createApi({
    reducerPath: 'basketApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Basket'],
    endpoints: (builder) => ({
        fetchBasket: builder.query<Basket, void>({
            query: () => 'basket',
            providesTags: ['Basket']
        }),
        addBasketItem: builder.mutation<Basket, {product: Product | Item, quantity: number}>({
            query: ({product, quantity}) => {
                const productId = isBasketItem(product) ? product.productId : product.id; //type guard
                return {
                    url: `basket?productId=${productId}&quantity=${quantity}`,
                    method: 'POST'
                }
            },
            onQueryStarted: async ({product, quantity}, {dispatch, queryFulfilled}) => {
                let isNewBasket = false;
                const patchResult = dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => { //(<Name of query to update>, <Query parameters>, A temporary copy called 'draft' to receive cached basket and edit directly)
                        const productId = isBasketItem(product) ? product.productId : product.id;

                        if (!draft?.basketId) isNewBasket = true;

                        if(!isNewBasket){
                            const existingItem = draft.items.find(item => item.productId === productId);
                            if (existingItem) existingItem.quantity += quantity;
                            //Add product to draft.items. If product is already a basket item, use it directly. 
                            // Otherwise, make a new object with all product fields plus productId and quantity
                            else draft.items.push(isBasketItem(product) ? product : {...product, productId: product.id, quantity}); //... is spread operator
                        }

                    })
                )
                try {
                    await queryFulfilled;
                    if (isNewBasket) dispatch(basketApi.util.invalidateTags(['Basket'])); //Invalidating cache as cache does not auto reload when new item is added to basket
                } catch (error) {
                    console.log(error);
                    patchResult.undo();
                }
            }
        }),
        removeBasketItem: builder.mutation<Basket, {productId: number, quantity: number}>({
            query: ({productId, quantity}) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: 'DELETE'
            }),
            onQueryStarted: async ({productId, quantity}, {dispatch, queryFulfilled}) => {
                const patchResult = dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        const itemIndex = draft.items.findIndex(item => item.productId === productId);
                        if (itemIndex >= 0) {
                            draft.items[itemIndex].quantity -= quantity;
                            if (draft.items[itemIndex].quantity <= 0){
                                draft.items.splice(itemIndex, 1);
                            }
                        }
                    })
                )
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.log(error);
                    patchResult.undo();
                }
            }
        })    
    })
});

export const {useFetchBasketQuery, useAddBasketItemMutation, useRemoveBasketItemMutation} = basketApi;