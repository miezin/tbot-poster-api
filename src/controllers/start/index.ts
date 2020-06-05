import {
  Extra,
  Stage,
  BaseScene
} from 'telegraf';

import { PosterService } from '../../api/poster';
import { createCategoriesKeyboard } from '../../util/keyboards';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { CartService } from '../../mocks/cart';
import { ActionState } from '../../models/actionState';

const start = new BaseScene('start');

start.enter(async (ctx: SceneContextMessageUpdate) => {
  const { reference } = ctx.scene.state as ActionState;
  const categories = await PosterService.getCategories();
  const cartTotal = CartService.getTotal();
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
