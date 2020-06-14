import { Markup } from "telegraf";
import { ReplyKeyboardMarkup } from "telegraf/typings/telegram-types";
import { MainKeyboard } from '../config/texts';

export const createMainKeyboard = (): Markup & ReplyKeyboardMarkup => {
  return Markup.keyboard(
    [
      [MainKeyboard.menu, MainKeyboard.cart],
      [MainKeyboard.contacts]
    ], {}).resize();
}
