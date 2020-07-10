import {
  Extra,
  Stage,
  BaseScene
} from 'telegraf';

import { PosterService } from '../../api/poster';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { ActionState } from 'actionState';
import Cart from '../../models/Cart';
import { createCategoriesKeyboard } from '../../keyboards/categories';

const menu = new BaseScene('menu');

menu.enter(async (ctx: SceneContextMessageUpdate) => {
  const { reference } = ctx.scene.state as ActionState;
  const uid = String(ctx.from.id);
  const categories = await PosterService.getCategories();
  const cart = await Cart.findOne({_id: uid})
  const cartTotal = cart ? cart.getTotal() : null;
  const keyboard = createCategoriesKeyboard(categories, cartTotal);

  if (reference) {
    await ctx.editMessageText('Выберите категорию 👇', Extra.markup(keyboard));
  } else {
    await ctx.reply('Выберите категорию 👇', Extra.markup(keyboard));
  }

});

export default menu;
