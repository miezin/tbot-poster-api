import { Product } from "../models/poster";


class Cart {
  cart: any[] = [];

  getCart() {
    return this.cart;
  }

  resetCart() {
    this.cart = [];
  }

  toCart(product: any) {
    this.cart.push(product);
  }

  getTotal() {
    return this.cart.reduce((acc, prb: Product) => {
      return acc + Number(prb.price['1']);
    }, 0) / 100;
  }
}

export const CartService = new Cart();
