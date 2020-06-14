import { Markup } from "telegraf";
import { createCartButton } from "./cart";
import { Category } from "../models/Category";
import { emojiMap } from "../config/emojiMap";
import { InlineKeyboardMarkup } from "telegraf/typings/telegram-types";

export const createCategoriesKeyboard = (categories: Category[], cartTotal?: number): Markup & InlineKeyboardMarkup => {
  const keyboard = categories.map((category: Category) => {
    const { categoryName, categoryId } = category;
    const emoji = emojiMap[categoryName];
    return [Markup.callbackButton(`${emoji || ''}  ${categoryName}`, JSON.stringify({ catId: categoryId }))];
  });
  keyboard.push([
    createCartButton(cartTotal, JSON.stringify({ cart: 'menu' })),
  ])

  return Markup.inlineKeyboard(keyboard, {});
}
