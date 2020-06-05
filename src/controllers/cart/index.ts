import {
  Markup,
  Extra,
  Stage,
  BaseScene
} from 'telegraf';

import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { CartService } from '../../mocks/cart';
import { Product } from '../../models/poster';
import { ActionState } from '../../models/actionState';

const cart = new BaseScene('cart');

interface CartResult {
  name: string;
  quantity: number;
  total: number;
}

const groupProducts = (products: Product[]) => {
  const result: CartResult[] = [];
  products.forEach((product) => {
    const {product_name, price} = product;
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



const generateCartList = (products: Product[]) => {
  let text = '<b>Моя корзина:</b>\n';
  const productsList = groupProducts(products);
  productsList.forEach(({name, total, quantity}) => {
    text += `\n<b> ✅ ${name} ✖️ ${quantity} = ${total}₴</b>\n`
  });
  if (!productsList.length) {
    text += '\nДобавь сюда вкусненького 🤤';
  }
  text += `\n<b>Общая сумма заказа: ${CartService.getTotal()}₴</b>`

  return text;
}

cart.enter(async (ctx: SceneContextMessageUpdate) => {
  const cartData = CartService.getCart();
  const keyboard = [
    [Markup.callbackButton('⬅️ Продолжить выбор', 'back')]
  ];

  if (cartData.length) {
    keyboard.unshift([
      Markup.callbackButton('✖️ Я передумал(а)', 'reset'),
      Markup.callbackButton('🍽 Заверните', 'checkout')
    ])
  }

  ctx.editMessageText(generateCartList(cartData), Extra.HTML().markup((m: Markup) => {
    return m.inlineKeyboard(keyboard, {})
  }));
});

cart.action('reset', (ctx: SceneContextMessageUpdate) => {
  CartService.resetCart();
  ctx.scene.reenter();
});

cart.action('back', (ctx: SceneContextMessageUpdate) => {
  const { catId } = ctx.scene.state as ActionState;

  if (catId) {
    ctx.scene.enter('products', { catId });
  } else {
    ctx.scene.enter('start', {reference: 'cart'});
  }

});

export default cart;
