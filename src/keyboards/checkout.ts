import { Markup } from "telegraf";
import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from "telegraf/typings/telegram-types";
import { CallbackButton } from "telegraf/typings/markup";
import { CheckoutKeyboard, CheckoutUi } from "../config/texts";

export const createConfirmOrderKeyboard = (orderId: string): Markup & InlineKeyboardMarkup => {
  const keyboard = [
    [
      Markup.callbackButton(CheckoutUi.orderSubmit, JSON.stringify({orderSubmit: orderId})),
      Markup.callbackButton(CheckoutUi.orderCancel, JSON.stringify({orderCancel: orderId}))
    ],
  ];

  return Markup.inlineKeyboard(keyboard, {});
}

export const createCheckoutKeyboard = (): Markup & ReplyKeyboardMarkup => {
  return Markup.keyboard(
    [
      [Markup.contactRequestButton(CheckoutKeyboard.shareContact)],
      [CheckoutKeyboard.back]
    ], {}).resize();
}
