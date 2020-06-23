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

export const editProductQuantity = async (ctx: SceneContextMessageUpdate, productId: string, action: 'add' | 'delete') => {
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({_id: uid});

  if (action === 'add') {
    await cart.addOneMoreProduct(productId);
  } else {
    await cart.deleteById(productId);
  }

  await cart.save();

  const products = cart ? await cart.getGroupedProducts() : [];
  const productToEdit = products.find(({id}) => id === productId);
  const balance = await cart.getQuantityById(productId);

  if (!products.length) {
    ctx.deleteMessage();
    ctx.answerCbQuery(Notifier.clearedCart);
    ctx.scene.enter('menu');
    return;
  }

  if (balance === 0) {
    const keyboard = createSelectToEditKeyboard(products);
    ctx.editMessageText(await generateCartList(cart), Extra.HTML().markup(keyboard));
    return;
  }

  const keyboard = createEditCartKeyBoard(productToEdit);
  ctx.editMessageText(await generateCartList(cart), Extra.HTML().markup(keyboard));
}

export const cartReduceProductQuantity = (ctx: SceneContextMessageUpdate): void  => {
  const { cartReducePr } = JSON.parse(ctx.callbackQuery.data);
  editProductQuantity(ctx, cartReducePr, 'delete');
}

export const cartIncraseProductQuantity = (ctx: SceneContextMessageUpdate): void  => {
  const { cartIncreacePr } = JSON.parse(ctx.callbackQuery.data);
  editProductQuantity(ctx, cartIncreacePr, 'add');
}

export const cartDeleteProduct = async (ctx: SceneContextMessageUpdate): Promise<void> => {
  const { cartDeletePr } = JSON.parse(ctx.callbackQuery.data);
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({_id: uid});
  await cart.deleteAllById(cartDeletePr);
  await cart.save();
  const products = cart ? await cart.getGroupedProducts() : [];

  if (!products.length) {
    ctx.deleteMessage();
    ctx.answerCbQuery(Notifier.clearedCart);
    ctx.scene.enter('menu');
    return;
  }

  const keyboard = createSelectToEditKeyboard(products);
  ctx.editMessageText(await generateCartList(cart), Extra.HTML().markup(keyboard));
}
