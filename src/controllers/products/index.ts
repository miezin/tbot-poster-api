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
import { asyncWrapper } from '../../util/error-handler';

const addToCart = async (ctx: ContextMessageUpdate) => {
  const { addPrId } = JSON.parse(ctx.match.input);
  const { products } = ctx.scene.state as ActionState;
  const uid = String(ctx.from.id);

  const product = await PosterService.getProductById(addPrId);

  if (!product) {
    ctx.answerCbQuery(`${Notifier.error}`);
    return;
  }

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
  await ctx.editMessageReplyMarkup(keyboard);
  await ctx.answerCbQuery(`✅ ${product.productName} ${Notifier.addedToCart} ✅`);
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
  await ctx.editMessageText(`${emoji || ''}  ${categoryName}`, Extra.markup(keyboard));
});

products.leave(async (ctx: SceneContextMessageUpdate) => {
  ctx.scene.reset();
});

products.action(/addPrId/gi, asyncWrapper(addToCart));

products.action('back', asyncWrapper(async(ctx: SceneContextMessageUpdate) => {
  await ctx.scene.enter('menu', { reference: 'products' });
}));

export default products;
