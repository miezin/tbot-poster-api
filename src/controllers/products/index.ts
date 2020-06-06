import {
  Extra,
  BaseScene
} from 'telegraf';

import { PosterService } from '../../api/poster';
import { createProductsKeyboard } from '../../keyboards/keyboards';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { ContextMessageUpdate } from 'telegraf-context';
import { ActionState } from 'actionState';
import { emojiMap } from '../../config/emojiMap';
import Cart from '../../models/Cart';

const addToCart = async (ctx: ContextMessageUpdate) => {
  const { prId } = JSON.parse(ctx.match.input);
  const { products } = ctx.scene.state as ActionState;
  const uid = String(ctx.from.id);

  const product = await PosterService.getProductById(prId);
  let cart = await Cart.findOne({_id: uid});

  if (cart) {
    cart.addProduct(product);
    await cart.save();
  } else {
    cart = new Cart({
      _id: uid,
      products: [product],
      quantity: 1,
      total: Number(product.price['1']) / 100,
    });
    await cart.save();
  }

  const cartTotal = cart.getTotal();

  const keyboard = createProductsKeyboard(products, cartTotal)
  ctx.editMessageReplyMarkup(keyboard);
  ctx.answerCbQuery(`${product.product_name} в твоей корзине`);
}

const products = new BaseScene('products');

products.enter(async (ctx: SceneContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const catId = (ctx.scene.state as ActionState).catId || JSON.parse(ctx.callbackQuery.data).catId;
  const products = await PosterService.getProductsByCategoryId(catId);
  const categoryName = products[0].category_name;
  const emoji = emojiMap[categoryName];
  const cart = await Cart.findOne({_id: uid});
  const cartTotal = cart ? cart.getTotal() : null;

  const keyboard = createProductsKeyboard(products, cartTotal);

  ctx.scene.state = { catId, products };
  ctx.editMessageText(`${emoji || ''}  ${categoryName}`, Extra.markup(keyboard));
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
