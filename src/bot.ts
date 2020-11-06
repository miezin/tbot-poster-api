import {
  Telegraf,
  Telegram,
  Stage,
  session
} from 'telegraf';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import mongoose from 'mongoose';

import {
  TELEGRAM_TOKEN,
  MONGODB_URI,
  WEBHOOK_DOMAIN
} from './config/secrets';
import {
  cartCtrl,
  cartResetCtrl,
  cartEdit,
  cartEditProduct,
  cartReduceProductQuantity,
  cartIncraseProductQuantity,
  cartDeleteProduct
} from './controllers/cart';
import menuScene from './controllers/menu';
import productsScene from './controllers/products';
import superWizard, { submitOrder, cancelOrder } from './controllers/checkout';
import { sessionSaver } from './middlewares/session-saver';
import { updateUserActivity } from './middlewares/update-user-activity';
import { isUserBanned } from './middlewares/ban-checker';
import { contactsCtrl } from './controllers/contacts';
import { startCtrl } from './controllers/start';
import { MainKeyboard } from './config/enums';
import { errorHandler } from './util/error-handler';
import ngrok from 'ngrok';

// TODO
// 3. added weights, ingredients ?? description

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
});

mongoose.connection.on('error', err => {
  console.error(
    undefined,
    'Error occurred during an attempt to establish connection with the database: %O',
    err
  );
  process.exit(1);
});


mongoose.connection.on('open', async () => {
  const bot = new Telegraf(TELEGRAM_TOKEN, {});
  const stage = new Stage([
    menuScene,
    productsScene,
    superWizard
  ], { default: 'menu' });

  bot.use(session());
  bot.use(sessionSaver(mongoose));
  bot.use(updateUserActivity);
  bot.use(isUserBanned);
  bot.use(stage.middleware());

  bot.start(startCtrl);

  bot.hears(MainKeyboard.contacts, contactsCtrl);

  bot.hears(MainKeyboard.menu, async (ctx: SceneContextMessageUpdate) => {
    await ctx.scene.enter('menu');
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
  bot.action('close', async (ctx: SceneContextMessageUpdate) => {
    await ctx.deleteMessage();
  });

  // checkout actions
  bot.action('checkout', async (ctx: SceneContextMessageUpdate) => {
    await ctx.scene.enter('checkout');
  });
  bot.action(/orderSubmit/g, submitOrder);
  bot.action(/orderCancel/g, cancelOrder);
  bot.hears(MainKeyboard.cart, cartCtrl);

  bot.catch(errorHandler);

  // for dev purposes
  // bot.startPolling();

  bot.launch({
    webhook: {
      domain: `https://${WEBHOOK_DOMAIN}`,
      port: 3000
    }
  });
});

const telegram = new Telegram(TELEGRAM_TOKEN, {});
export default telegram;
