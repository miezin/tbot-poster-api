import { CartUi } from '../../config/enums';
import { CartInterface } from '../../models/Cart';

export const generateCartList = async (cart: CartInterface, customTitle?: string): Promise<string> => {
  let text = `<b>${customTitle || CartUi.title}</b>\n`;

  if (!cart) {
    text += `\n<b>${CartUi.placeholder}</b>\n`;
  } else {
    const productsByCategories = await cart.getGroupedProductsByCategory();
    const cartTotal = cart.getTotal();
    let index = 0;

    productsByCategories.forEach(({ category, products }) => {
      text += `\n${category}:\n`;
      products.forEach(({ name, amount, price, total }) => {
        text += `\n <b>${index += 1}</b>. ${name} ✖️ <b>${amount}</b> = <b>${total}₴</b>\n`;
      });
    });

    text += `\n <b>${CartUi.total} ${cartTotal}₴</b>`;
  }

  return text;
};
