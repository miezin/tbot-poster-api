import {emojiMap} from "../../config/emojiMap";
import {CartUi} from "../../config/texts";
import { Cart } from "../../models/Cart";

export const generateCartList = async (cart: Cart): Promise<string> => {
  let text = `<b>${CartUi.title}</b>\n`;

  if (!cart) {
    text += `\n<b>${CartUi.placeholder}</b>\n`;
  } else {
    const productsByCategories = await cart.getGroupedProducts();
    const cartTotal = cart.getTotal();
    let index = 0;

    productsByCategories.forEach(({category, products}) => {
      const fullCatName = `${emojiMap[category]} ${category}`;
      text += `\n${fullCatName}:\n`;
      products.forEach(({ name, amount, price, total }) => {
        text += `\n <b>${index += 1}</b>. ${name} ✖️ <b>${amount}</b> = <b>${total}₴</b>\n`
      });
    })

    text += `\n<b>${CartUi.total} ${cartTotal}₴</b>`;
  }

  return text;
}
