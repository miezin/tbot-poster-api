import { Product } from "../models/Product";
import { Markup } from "telegraf";
import { createCartButton } from "./cart";
import { Cart } from "../models/Cart";
import { InlineKeyboardMarkup } from "telegraf/typings/telegram-types";

export const createProductsKeyboard = (products: Product[], cart: Cart): Markup & InlineKeyboardMarkup => {
  const keyboard = products.map((product: Product) => {
    const { productName, productId, price } = product;
    const amountInCart = cart ? cart.getQuantityById(productId) : 0;
    const amountInCartText = amountInCart ? `🛒 (${amountInCart})` : '';
    return [Markup.callbackButton(`${productName}  - ${price}₴ ${amountInCartText}`, JSON.stringify({ addPrId: productId }))];
  });
  const totalInCart = cart ? cart.getTotal() : 0;
  keyboard.push([
    Markup.callbackButton('⬅️ Назад', 'back'),
    createCartButton(totalInCart, 'cart')
  ]);

  return Markup.inlineKeyboard(keyboard, {});
}
