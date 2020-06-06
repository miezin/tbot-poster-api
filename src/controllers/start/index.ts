import {
  Extra,
  Stage,
  BaseScene
} from 'telegraf';

import { PosterService } from '../../api/poster';
import { createCategoriesKeyboard } from '../../keyboards/keyboards';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { ActionState } from 'actionState';
import Cart from '../../models/Cart';

const start = new BaseScene('start');

start.enter(async (ctx: SceneContextMessageUpdate) => {
  const { reference } = ctx.scene.state as ActionState;
  const uid = String(ctx.from.id);
  const categories = await PosterService.getCategories();
  const cart = await Cart.findOne({_id: uid})
  const cartTotal = cart ? cart.getTotal() : null;
  const keyboard = createCategoriesKeyboard(categories, cartTotal);

  if (reference) {
    ctx.editMessageText('Выберите категорию 👇', Extra.markup(keyboard));
  } else {
    ctx.reply('Выберите категорию 👇', Extra.markup(keyboard));
  }

});

start.action(/catId/gi, (ctx: SceneContextMessageUpdate) => ctx.scene.enter('products'));

start.action(/cart/gi, (ctx: SceneContextMessageUpdate) => {
  ctx.scene.enter('cart');
});

export default start;
