import {
  Extra
} from 'telegraf';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';

import Cart from '../../models/Cart';
import { createCartKeyboard, createSelectToEditKeyboard, createEditCartKeyBoard} from '../../keyboards/cart';
import { Notifier } from "../../config/notification";
import { generateCartList } from "./helpers";


export const cartCtrl = async (ctx: SceneContextMessageUpdate): Promise<void> => {
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({_id: uid});
  const products = cart ? cart.products : [];
  const total = cart ? cart.getTotal() : 0;
  const quantity = cart ? cart.getQuantity() : 0;
  const keyboard = createCartKeyboard(products, total, quantity);
  if (!products.length && ctx.callbackQuery) {
    ctx.answerCbQuery(Notifier.emptyCart);
  } else if (ctx.callbackQuery?.data === 'backFromEdit') {
    ctx.editMessageText(await generateCartList(cart), Extra.HTML().markup(keyboard));
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
  const cartProducts = cart ? await cart.getGroupedProducts() : [];
  const keyboard = createSelectToEditKeyboard(cartProducts);
  ctx.editMessageText(await generateCartList(cart), Extra.HTML().markup(keyboard));
}

export const cartEditProduct = async (ctx: SceneContextMessageUpdate): Promise<void> => {
  const { prIdToEdit } = JSON.parse(ctx.callbackQuery.data);
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({_id: uid});
  const products = cart ? await cart.getGroupedProducts() : [];
  const productToEdit = products.find(({id}) => id === prIdToEdit);
  const keyboard = createEditCartKeyBoard(productToEdit);
  ctx.editMessageText(await generateCartList(cart), Extra.HTML().markup(keyboard));
}

export const cartReduceProductQuantity = async (ctx: SceneContextMessageUpdate): Promise<void>  => {
  const { cartReducePr } = JSON.parse(ctx.callbackQuery.data);
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({_id: uid});
  cart.deleteById('1')
}

// export const cartAddLastProductCtrl = (ctx: SceneContextMessageUpdate): void => {
//   cartEditLastProduct(ctx, 'add');
// }

// export const cartDeleteLastProductCtrl = (ctx: SceneContextMessageUpdate): void => {
//   cartEditLastProduct(ctx, 'delete');
// }
