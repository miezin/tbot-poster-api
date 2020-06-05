import {
  Telegraf,
  Markup,
  Context,
  Extra,
  Stage,
  session
} from 'telegraf';

import {
  TELEGRAM_TOKEN
} from './config/secrets';
import startScene from './controllers/start';
import productsScene from './controllers/products';
import cartScene from './controllers/cart';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';

const bot = new Telegraf(TELEGRAM_TOKEN, {});


const stage = new Stage([startScene, cartScene, productsScene]);


bot.use(session());
bot.use(stage.middleware());

bot.start((ctx: SceneContextMessageUpdate) => ctx.scene.enter('start'));

bot.launch();
