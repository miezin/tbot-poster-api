import { Markup } from 'telegraf';
import { createCartButton } from './cart';
import { CategoryInterface } from '../models/Category';
import { InlineKeyboardMarkup } from 'telegraf/typings/telegram-types';

export const createCategoriesKeyboard = (categories: CategoryInterface[], cartTotal?: number): Markup & InlineKeyboardMarkup => {
  const keyboard = categories.map((category: CategoryInterface) => {
    const { categoryName, categoryId } = category;
    return [Markup.callbackButton(categoryName, JSON.stringify({ catId: categoryId }))];
  });
  keyboard.push([
    createCartButton(cartTotal, 'cart')
  ]);

  return Markup.inlineKeyboard(keyboard, {});
};
