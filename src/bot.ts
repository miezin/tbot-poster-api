import {
  Telegraf,
  Stage,
  session,
  Telegram,
  Context,
  Markup,
  Extra
} from 'telegraf';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import mongoose, { HookNextFunction } from 'mongoose';

import {
  TELEGRAM_TOKEN, MONGODB_URI
} from './config/secrets';
import startScene from './controllers/start';
import productsScene from './controllers/products';
import cartScene from './controllers/cart';
import { sessionSaver } from './middlewares/session-saver';
import { ContextMessageUpdate } from 'telegraf-context';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
});

mongoose.connection.on('error', err => {
  console.error(
    undefined,
    `Error occurred during an attempt to establish connection with the database: %O`,
    err
  );
  process.exit(1);
});

mongoose.connection.on('open', () => {
  const bot = new Telegraf(TELEGRAM_TOKEN, {});
  const stage = new Stage([startScene, cartScene, productsScene]);

  bot.use(session());
  bot.use(sessionSaver(mongoose));
  bot.use(stage.middleware());

  bot.start((ctx: ContextMessageUpdate) => {
    console.log(ctx);
    console.log(ctx.scene.current);
    const keyboard = Markup.keyboard(
      [
        ['Меню','Контакты'],
        ['Оставить отзыв', 'Настройки']
      ], {});
    ctx.reply('Чем могу быть полезен', Extra.markup(keyboard.resize()))
  });
  bot.hears('Меню', (ctx: SceneContextMessageUpdate) => {
    ctx.scene.enter('start');
  })
  bot.launch();
});
