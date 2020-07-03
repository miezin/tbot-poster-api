import {
  Telegraf,
  Telegram,
  Stage,
  session,
  Extra
} from 'telegraf';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import mongoose from 'mongoose';

import {
  TELEGRAM_TOKEN, MONGODB_URI
} from './config/secrets';
import menuScene from './controllers/menu';
import productsScene from './controllers/products';
import { sessionSaver } from './middlewares/session-saver';
import { ContextMessageUpdate } from 'telegraf-context';
import {cartCtrl, cartResetCtrl, cartEdit, cartEditProduct, cartReduceProductQuantity, cartIncraseProductQuantity, cartDeleteProduct} from './controllers/cart';
import superWizard, { submitOrder, cancelOrder } from './controllers/checkout';
import { createMainKeyboard } from "./keyboards/main";
import { updateUserActivity } from './middlewares/update-user-activity';

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
  const stage = new Stage([
    menuScene,
    productsScene,
    superWizard
  ], {default: 'menu'});

  bot.use(session());
  bot.use(sessionSaver(mongoose));
  bot.use(updateUserActivity);
  bot.use(stage.middleware());

  bot.start((ctx: ContextMessageUpdate) => {
    ctx.reply('Чем могу быть полезен', Extra.markup(createMainKeyboard()));
  });

  bot.hears('Меню', (ctx: SceneContextMessageUpdate) => {
    ctx.scene.enter('menu');
  });

  // category entry action
  bot.action(/catId/gi, (ctx: SceneContextMessageUpdate) => ctx.scene.enter('products'));

  // cart actions
  bot.action('cart', cartCtrl);
  bot.action('reset', cartResetCtrl);
  bot.action('edit', cartEdit);
  bot.action('backFromEdit', cartCtrl);
  bot.action('backFromPrEdit', cartEdit);
  bot.action(/prIdToEdit/g, cartEditProduct);
  bot.action(/cartReducePr/g, cartReduceProductQuantity);
  bot.action(/cartIncreacePr/g, cartIncraseProductQuantity);
  bot.action(/cartDeletePr/g, cartDeleteProduct);
  bot.action('close', (ctx: SceneContextMessageUpdate) => {
    ctx.deleteMessage();
  });

  // checkout actions
  bot.action('checkout', (ctx: SceneContextMessageUpdate) => {
    ctx.scene.enter('checkout');
  })
  bot.action(/orderSubmit/g, submitOrder)
  bot.action(/orderCancel/g, cancelOrder)

  bot.hears('Корзина', cartCtrl);

  bot.startPolling();
});

const telegram = new Telegram(TELEGRAM_TOKEN, {});
export default telegram;
