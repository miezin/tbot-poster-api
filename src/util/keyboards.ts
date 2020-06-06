import {
  Markup
} from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/telegram-types';

import { Category, Product } from '../models/poster';
import { emojiMap } from '../config/emojiMap';
import { CallbackButton } from 'telegraf/typings/markup';

export const createCategoriesKeyboard = (categories: Category[], cartTotal?: number): Markup & InlineKeyboardMarkup => {
  const keyboard = categories.map((category: Category) => {
      const { category_name, category_id } = category;
      const emoji = emojiMap[category_name]
      return [Markup.callbackButton(`${emoji || ''} ${category_name}`, JSON.stringify({ catId: category_id }))];
  });
  keyboard.push([
      Markup.callbackButton('📞 Контакты', 'cotacts'),
      createCartKeyboard(cartTotal, JSON.stringify({cart: 'start'})),
  ])

  return Markup.inlineKeyboard(keyboard, {});
}

export const createProductsKeyboard = (products: Product[], cartTotal?: number): Markup & InlineKeyboardMarkup => {
  const keyboard = products.map((product: Product) => {
      const { product_name, product_id, price } = product;
      return [Markup.callbackButton(`${product_name}  - ${Number(price['1']) / 100}₴`, JSON.stringify({ prId: product_id }))];
  });
  keyboard.push([
      Markup.callbackButton('⬅️ Назад', 'back'),
      createCartKeyboard(cartTotal, JSON.stringify({'cart': 'products'}))
  ]);

  return Markup.inlineKeyboard(keyboard, {});
}

export const createCartKeyboard = (cartTotal: number, callBackQuery: string): CallbackButton => {
  const cartText = cartTotal ? `🛒 Корзина (${cartTotal || ''}₴)` : '🛒 Корзина';
  return Markup.callbackButton(cartText, callBackQuery);
}
