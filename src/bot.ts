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
import { isUserBanned } from './middlewares/ban-checker';
import { asyncWrapper } from './util/error-handler';
import logger from './util/logger';
import { MainKeyboard } from './config/texts';
import { contactsCtrl } from './controllers/contacts';
import { startCtrl } from './controllers/start';

// TODO
// 1. add error handling middlewares
// on error send message to user and show start menu to prevent any freezing in ui, buttons etc
// 2. checking is_hide in products and categoires reponse, to hide unused items
// 3. added weights, ingredients ?? description

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
  bot.use(isUserBanned);
  bot.use(stage.middleware());

  bot.start(asyncWrapper(startCtrl));

  bot.hears(MainKeyboard.contacts, asyncWrapper(contactsCtrl));

  bot.hears(MainKeyboard.menu, asyncWrapper(async (ctx: SceneContextMessageUpdate) => {
    await ctx.scene.enter('menu');
  }));

  // category entry action
  bot.action(/catId/gi, asyncWrapper((ctx: SceneContextMessageUpdate) => ctx.scene.enter('products')));

  // cart actions
  bot.action('cart', asyncWrapper(cartCtrl));
  bot.action('reset', asyncWrapper(cartResetCtrl));
  bot.action('edit', asyncWrapper(cartEdit));
  bot.action('backFromEdit', asyncWrapper(cartCtrl));
  bot.action('backFromPrEdit', asyncWrapper(cartEdit));
  bot.action(/prIdToEdit/g, asyncWrapper(cartEditProduct));
  bot.action(/cartReducePr/g, asyncWrapper(cartReduceProductQuantity));
  bot.action(/cartIncreacePr/g, asyncWrapper(cartIncraseProductQuantity));
  bot.action(/cartDeletePr/g, asyncWrapper(cartDeleteProduct));
  bot.action('close', (ctx: SceneContextMessageUpdate) => {
    ctx.deleteMessage();
  });

  // checkout actions
  bot.action('checkout', asyncWrapper((ctx: SceneContextMessageUpdate) => {
    ctx.scene.enter('checkout');
  }));
  bot.action(/orderSubmit/g, asyncWrapper(submitOrder))
  bot.action(/orderCancel/g, asyncWrapper(cancelOrder))

  bot.hears(MainKeyboard.cart, asyncWrapper(cartCtrl));

  bot.catch((error: any) => {
    logger.error(undefined, 'Global error has happened, %O', error);
  });

  // bot.startPolling();

  bot.launch({
    webhook: {
      domain: 'https://bot.gmzn.icu',
      port: 3000
    }
  });
});

const telegram = new Telegram(TELEGRAM_TOKEN, {});
export default telegram;
