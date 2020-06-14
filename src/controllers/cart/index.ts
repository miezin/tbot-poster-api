import {
  Extra
} from 'telegraf';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';

import Cart from '../../models/Cart';
import { createCartKeyboard, createSelectToEditKeyboard} from '../../keyboards/cart';
import { Notifier } from "../../config/notification";
import { generateCartList } from "./helpers";


export const cartCtrl = async (ctx: SceneContextMessageUpdate): Promise<void> => {
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({_id: uid});
  const products = cart ? cart.products : [];
  const total = cart ? cart.getTotal() : 0;
  const quantity = cart ? cart.getQuantity() : 0
  const keyboard = createCartKeyboard(products, total, quantity);
  if (!products.length && ctx.callbackQuery) {
    ctx.answerCbQuery(Notifier.emptyCart);
  } else {
    ctx.replyWithMarkdown(await generateCartList(cart), Extra.HTML().markup(keyboard));
  }
};

export const cartResetCtrl = async (ctx: SceneContextMessageUpdate): Promise<void>  => {
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({_id: uid});
  cart.reset();
  await cart.save();
  ctx.deleteMessage();
  ctx.answerCbQuery(Notifier.clearedCart);
  ctx.scene.enter('menu');
};

export const cartEdit = async (ctx: SceneContextMessageUpdate): Promise<void> => {
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({_id: uid});
  const cartPositionsQuantity = cart ? await cart.getGroupedProductsQuantity() : 0;
  const keyboard = createSelectToEditKeyboard(cartPositionsQuantity);
  ctx.editMessageText(await generateCartList(cart), Extra.HTML().markup(keyboard));
}

export const cartEditLastProduct = async (ctx: SceneContextMessageUpdate, action: string): Promise<void>  => {
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({_id: uid});
  const lastIdx = cart.products.length - 1;
  if (action === 'add') {
    cart.products.push(cart.products[lastIdx]);
  } else {
    cart.products.pop();
  }

  await cart.save();
  const keyboard = createCartKeyboard(cart.products, cart.getTotal(), cart.getQuantity());
  if (!cart.products.length) {
    ctx.deleteMessage();
    ctx.answerCbQuery(Notifier.clearedCart);
    ctx.scene.enter('menu');
  } else {
    ctx.editMessageText(await generateCartList(cart), Extra.HTML().markup(keyboard));
  }
}

export const cartAddLastProductCtrl = (ctx: SceneContextMessageUpdate): void => {
  cartEditLastProduct(ctx, 'add');
}

export const cartDeleteLastProductCtrl = (ctx: SceneContextMessageUpdate): void => {
  cartEditLastProduct(ctx, 'delete');
}
