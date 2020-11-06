import { Markup } from 'telegraf';
import { ProductInterface } from '../models/Product';
import { InlineKeyboardMarkup } from 'telegraf/typings/telegram-types';
import { CallbackButton } from 'telegraf/typings/markup';
import { CartUi } from '../config/enums';
import { CartResultProduct } from '../models/Cart';


export const createCartButton = (cartTotal: number, callBackQuery: string): CallbackButton => {
  const cartText = cartTotal ? `${CartUi.cart} (${cartTotal || ''}₴)` : CartUi.cart;
  return Markup.callbackButton(cartText, callBackQuery);
};

export const createCartKeyboard = (
  products: ProductInterface[],
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
};

export const createSelectToEditKeyboard = (cartProducts: CartResultProduct[]): Markup & InlineKeyboardMarkup => {
  const keyboard = [[Markup.callbackButton(CartUi.back, 'backFromEdit', !Boolean(cartProducts.length))]];
  let row: CallbackButton[] = [];

  cartProducts.forEach(({ id }, idx) => {
    row.push(Markup.callbackButton(`${idx + 1}`, JSON.stringify({ prIdToEdit: id })));

    if (row.length === 6) {
      keyboard.push(row);
      row = [];
    }
  });

  if (row.length) {
    keyboard.push(row);
  }

  return Markup.inlineKeyboard(keyboard).resize();
};

export const createEditCartKeyBoard = (product: CartResultProduct): Markup & InlineKeyboardMarkup => {
  const { id, name, amount } = product;

  const keyboard = [
    [Markup.callbackButton(`${name}`, 'dummy')],
    [
      Markup.callbackButton(CartUi.reduce, JSON.stringify({ cartReducePr: id })),
      Markup.callbackButton(`${amount} шт.`, 'dummy'),
      Markup.callbackButton(CartUi.increace, JSON.stringify({ cartIncreacePr: id })),
      Markup.callbackButton(CartUi.delete, JSON.stringify({ cartDeletePr: id }))
    ],
    [Markup.callbackButton(CartUi.back, 'backFromPrEdit')]
  ];

  return Markup.inlineKeyboard(keyboard);
};

export const createCheckoutButton = (cartQuantity: number, cartTotal: number): CallbackButton => {
  const hideBtn = !Boolean(cartQuantity);
  return Markup.callbackButton(`${CartUi.checkout} (${cartQuantity}) - ${cartTotal}₴`, 'checkout', hideBtn);
};

