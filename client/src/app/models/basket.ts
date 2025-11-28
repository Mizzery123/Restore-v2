import type { Product } from "./product";

export type Basket = {
  basketId: string //Basket unique id
  items: Item[] //Array of item objects aka products in the basket
}

export class Item { //Represent one product in basket

    constructor(product: Product, quantity: number){ //Constructor allows you to create new Item by passing a Product and a quantity
        this.productId = product.id;
        this.name = product.name;
        this.brand = product.brand;
        this.price = product.price;
        this.pictureUrl = product.pictureUrl;
        this.quantity = quantity;
        this.type = product.type;
    }

  productId: number
  name: string
  price: number
  pictureUrl: string
  brand: string
  type: string
  quantity: number
}
