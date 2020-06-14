import {
  Extra,
  BaseScene
} from 'telegraf';

import { PosterService } from '../../api/poster';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { ContextMessageUpdate } from 'telegraf-context';
import { ActionState } from 'actionState';
import { emojiMap } from '../../config/emojiMap';
import Cart from '../../models/Cart';
import { createProductsKeyboard } from '../../keyboards/products';
import { Notifier } from "../../config/notification";

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
      products: [product]
    });
    await cart.save();
  }

  const keyboard = createProductsKeyboard(products, cart);
  ctx.editMessageReplyMarkup(keyboard);
  ctx.answerCbQuery(`✅ ${product.productName} ${Notifier.addedToCart} ✅`);
}

const products = new BaseScene('products');

products.enter(async (ctx: SceneContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const catId = (ctx.scene.state as ActionState).catId || JSON.parse(ctx.callbackQuery.data).catId;
  const products = await PosterService.getProductsByCategoryId(catId);
  const categoryName = products[0].categoryName;
  const emoji = emojiMap[categoryName];
  const cart = await Cart.findOne({_id: uid});

  const keyboard = createProductsKeyboard(products, cart);

  ctx.scene.state = { catId, products };
  ctx.editMessageText(`${emoji || ''}  ${categoryName}`, Extra.markup(keyboard));
});

products.leave(async (ctx: SceneContextMessageUpdate) => {
  ctx.scene.reset();
});

products.action(/prId/gi, addToCart);

products.action('back', (ctx: SceneContextMessageUpdate) => {
  ctx.scene.enter('menu', { reference: 'products' });
});

export default products;
