import { Markup, Extra } from 'telegraf';
import { createMainKeyboard } from '../../keyboards/main';
import { ContextMessageUpdate } from 'telegraf-context';
import { generateCartList } from '../cart/helpers';
import { createConfirmOrderKeyboard } from '../../keyboards/checkout';
import { createCheckoutKeyboard } from '../../keyboards/checkout';
import Cart from '../../models/Cart';
import User from '../../models/User';
import Order from '../../models/Order';
import { Notifier } from '../../config/notification';
import { CheckoutKeyboard, CheckoutUi } from '../../config/enums';
import { PosterService } from '../../api/poster';

// TODO refactoring

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Composer = require('telegraf/composer');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WizardScene = require('telegraf/scenes/wizard');

// not final version

interface OrderClientData {
  phoneNumber: string;
  firstName: string;
  comment: string;
}


const generateSubmitBottomText = (orderClientData: OrderClientData): string => {
  const {
    phoneNumber,
    firstName,
    comment
  } = orderClientData;
  return `
<b>
Имя: ${firstName}

Контактный телефон: ${phoneNumber}

Комментарий к заказу: ${comment}
</b>`;
};

const backToMenuCtrl = async (ctx: ContextMessageUpdate) => {
  await ctx.reply(CheckoutUi.checkoutCancel, Extra.markup(createMainKeyboard()));
  await ctx.scene.enter('menu');
};

const askContactStepCtrl = async (ctx: ContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const user = await User.findOne({ userId: uid });

  if (user && !user.phone) {
    await ctx.reply(CheckoutUi.contactStep, Extra.markup(createCheckoutKeyboard()));
    await ctx.wizard.next();
  } else {
    await ctx.reply(CheckoutUi.commentStep);
    await ctx.wizard.selectStep(2);
  }
};

const phoneStepCtrl = async (ctx: ContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const user = await User.findOne({ userId: uid });
  let phoneNumber;

  if (ctx.message.contact) {
    phoneNumber = ctx.message.contact.phone_number;
  } else {
    phoneNumber = ctx.message.text;
  }

  user.phone = phoneNumber;
  await user.save();

  await ctx.reply(`${CheckoutUi.phoneAdded}. ${CheckoutUi.commentStep}`, Extra.markup(Markup.keyboard([CheckoutKeyboard.back])
    .resize()
  ));
  return ctx.wizard.next();
};

const commentStepCtrl = async (ctx: ContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({ _id: uid });
  const user = await User.findOne({ userId: uid });
  const order = new Order({
    status: 'pending',
    userId: user.userId,
    firstName: user.firstName,
    phone: user.phone,
    comment: ctx.message.text,
    products: await cart.getGroupedProducts() || []
  });
  await order.save();

  await ctx.scene.leave();
  const submitText = generateSubmitBottomText(
    {
      phoneNumber: user.phone,
      firstName: user.firstName,
      comment: ctx.message.text
    }
  );
  await ctx.reply(CheckoutUi.submitStep, Extra.markup(createMainKeyboard()));
  await ctx.replyWithHTML(`
  ${await generateCartList(cart, CheckoutUi.cartTotalTitle)}
  ${submitText}
  `, Extra.markup(createConfirmOrderKeyboard(order._id)));
};

// TODO add status enum for orders, refactoring submit ctrl

export const submitOrder = async (ctx: ContextMessageUpdate) => {
  const { orderSubmit } = JSON.parse(ctx.callbackQuery.data);
  const uid = String(ctx.from.id);
  const order = await Order.findOne({ _id: orderSubmit });

  if (order.status === 'confirmed' || order.status === 'loading') {
    return;
  }

  order.status = 'loading';
  await order.save();

  const successOrder = await PosterService.createOrder(order);

  if (successOrder.incoming_order_id) {
    order.status = 'confirmed';
    await order.save();
  } else {
    order.status = 'api_error';
  }

  const cart = await Cart.findOne({ _id: uid });
  cart.reset();
  await cart.save();

  const message = CheckoutUi.successMessage.replace('{N}', successOrder.incoming_order_id);
  await ctx.editMessageText(message);
};

export const cancelOrder = async (ctx: ContextMessageUpdate) => {
  const { orderCancel } = JSON.parse(ctx.callbackQuery.data);
  await Order.findOneAndDelete({ _id: orderCancel });
  await ctx.editMessageText(CheckoutUi.orderCancaled);
  await ctx.answerCbQuery(Notifier.orderDeleted);
};

const contactStepHandler = new Composer();
const commentStepHandler = new Composer();

commentStepHandler.on('text', commentStepCtrl);
contactStepHandler.on('contact', phoneStepCtrl);
contactStepHandler.phone(phoneStepCtrl);
commentStepHandler.hears(CheckoutKeyboard.back, backToMenuCtrl);
contactStepHandler.hears(CheckoutKeyboard.back, backToMenuCtrl);

contactStepHandler.use((ctx: any) => ctx.replyWithMarkdown(CheckoutUi.phoneValidationMessage));

const superWizard = new WizardScene('checkout',
  askContactStepCtrl,
  contactStepHandler,
  commentStepHandler
);

export default superWizard;
