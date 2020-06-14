import { Markup } from "telegraf";
import { Product } from "../models/Product";
import { InlineKeyboardMarkup } from "telegraf/typings/telegram-types";
import { CallbackButton } from "telegraf/typings/markup";
import {CartUi} from "../config/texts";


export const createCartButton = (cartTotal: number, callBackQuery: string): CallbackButton => {
  const cartText = cartTotal ? `${CartUi.cart} (${cartTotal || ''}₴)` : CartUi.cart;
  return Markup.callbackButton(cartText, callBackQuery);
}

export const createCartKeyboard = (
  products: Product[],
  cartTotal: number,
  cartQuantity: number
): Markup & InlineKeyboardMarkup => {
  const hideBtn = !Boolean(cartQuantity);
  const keyboard = [
    [
      Markup.callbackButton(CartUi.edit, 'edit', hideBtn),
      Markup.callbackButton(CartUi.cancel, 'reset', hideBtn)
    ],
    [createCheckoutButton(cartQuantity, cartTotal)]
  ];

  return Markup.inlineKeyboard(keyboard, {});
}

export const createSelectToEditKeyboard = (productQuantity: number): Markup & InlineKeyboardMarkup => {
  const keyboard = [[Markup.callbackButton(`Назад`, 'backFromEdit')]];
  let row = [];
  let _i = 0;
  while (_i <= productQuantity) {
    _i += 1;
    row.push(Markup.callbackButton(`${_i}`, JSON.stringify({edit: _i})))

    if (row.length === 6) {
      keyboard.push(row);
      row = []
    }
  }

  if (row.length) {
    keyboard.push(row);
  }

  keyboard.push()

  return Markup.inlineKeyboard(keyboard).resize();
}

export const createEditCartKeyBoard = (product: Product, productQuantity: Number): Markup & InlineKeyboardMarkup => {
  const { productId } = product;
  const keyboard = [
    Markup.callbackButton(CartUi.remove, JSON.stringify({remove: productId})),
    Markup.callbackButton(`${productQuantity}`, ''),
    Markup.callbackButton(CartUi.add, JSON.stringify({add: productId})),
  ]

  return Markup.inlineKeyboard([keyboard]);
}

export const createCheckoutButton = (cartQuantity: number, cartTotal: number): CallbackButton => {
  const hideBtn = !Boolean(cartQuantity);
  return Markup.callbackButton(`${CartUi.checkout} (${cartQuantity}) - ${cartTotal}₴`, 'checkout', hideBtn);
}


