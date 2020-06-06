import {
  Markup,
  Extra,
  BaseScene
} from 'telegraf';

import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { ActionState } from 'actionState';
import { Product } from '../../models/Product';
import Cart from '../../models/Cart';

const cart = new BaseScene('cart');

interface CartResult {
  name: string;
  quantity: number;
  total: number;
}

const groupProducts = (products: Product[]) => {
  const result: CartResult[] = [];
  products.forEach((product) => {
    const { product_name, price } = product;
    const existIdx = result.findIndex((p) => p.name === product_name);
    const parcedPrice = Number(price['1']) / 100;
    if (existIdx >= 0) {
      result[existIdx].quantity += 1;
      result[existIdx].total += parcedPrice;
    } else {
      result.push({
        name: product_name,
        quantity: 1,
        total: parcedPrice
      })
    }
  });
  return result;
}



const generateCartList = (products: Product[], total: number) => {
  let text = '<b>Моя корзина:</b>\n';
  const productsList = groupProducts(products);
  productsList.forEach(({ name, total, quantity }) => {
    text += `\n<b> ✅ ${name} ✖️ ${quantity} = ${total}₴</b>\n`
  });
  if (!productsList.length) {
    text += '\nДобавь сюда вкусненького 🤤';
  }
  text += `\n<b>Общая сумма заказа: ${total}₴</b>`

  return text;
}

cart.enter(async (ctx: SceneContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({_id: uid});
  const products = cart ? cart.products : [];
  const total = cart ? cart.getTotal() : 0;
  const keyboard = [
    [Markup.callbackButton('⬅️ Продолжить выбор', 'back')]
  ];

  if (products.length) {
    keyboard.unshift([
      Markup.callbackButton('✖️ Я передумал(а)', 'reset'),
      Markup.callbackButton('🍽 Заверните', 'checkout')
    ])
  }

  ctx.editMessageText(generateCartList(products, total), Extra.HTML().markup((m: Markup) => {
    return m.inlineKeyboard(keyboard, {})
  }));
});

cart.action('reset', async (ctx: SceneContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const cart = await Cart.findOne({_id: uid});
  cart.reset();
  await cart.save();
  ctx.scene.reenter();
});

cart.action('back', (ctx: SceneContextMessageUpdate) => {
  const { catId } = ctx.scene.state as ActionState;

  if (catId) {
    ctx.scene.enter('products', { catId });
  } else {
    ctx.scene.enter('start', { reference: 'cart' });
  }

});

export default cart;
