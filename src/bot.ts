import {
  Telegraf,
  Stage,
  session,
} from 'telegraf';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import mongoose from 'mongoose';

import {
  TELEGRAM_TOKEN, MONGODB_URI
} from './config/secrets';
import startScene from './controllers/start';
import productsScene from './controllers/products';
import cartScene from './controllers/cart';
import { sessionSaver } from './middlewares/session-saver';

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

  bot.start((ctx: SceneContextMessageUpdate) => ctx.scene.enter('start'));

  bot.launch();
});
