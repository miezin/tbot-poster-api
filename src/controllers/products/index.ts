import {
  Extra,
  BaseScene
} from 'telegraf';

import { PosterService } from '../../api/poster';
import { createCategoriesKeyboard, createProductsKeyboard } from '../../util/keyboards';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { CartService } from '../../mocks/cart';
import { ActionState } from '../../models/actionState';

const addToCart = async (ctx: SceneContextMessageUpdate) => {
  const { prId } = JSON.parse(ctx.match.input);
  const { products } = ctx.scene.state as ActionState;

  const product = await PosterService.getProductById(prId);
  CartService.toCart(product);

  const cartTotal = CartService.getTotal();
  const keyboard = createProductsKeyboard(products, cartTotal)
  ctx.editMessageReplyMarkup(keyboard);
  ctx.answerCbQuery(`${product.product_name} в твоей корзине`);
}

const products = new BaseScene('products')

products.enter(async (ctx: SceneContextMessageUpdate) => {
  const catId = (ctx.scene.state as ActionState).catId || JSON.parse(ctx.callbackQuery.data).catId;
  const products = await PosterService.getProductsByCategoryId(catId);
  const cartTotal = CartService.getTotal();
  const keyboard = createProductsKeyboard(products, cartTotal);

  ctx.scene.state = { catId, products };
  ctx.editMessageText('Name placeholder', Extra.markup(keyboard));
});

products.leave(async (ctx: SceneContextMessageUpdate) => {
  ctx.scene.reset();
});

products.action(/prId/gi, addToCart)

products.action(/cart/gi, (ctx: SceneContextMessageUpdate) => {
  const { catId } = ctx.scene.state as ActionState;
  ctx.scene.enter('cart', { catId });
});

products.action('back', (ctx: SceneContextMessageUpdate) => {
  ctx.scene.enter('start', { reference: 'products' });
});

export default products;
