import mongoose, { Document, Schema } from 'mongoose';
import { Product, ProductSchema } from './Product';

export interface Cart extends Document {
  _id: string;
  products: Product[];
  quantity: number;
  total: number;

  addProduct: (product: Product) => void;
  getQuantity: () => number;
  getTotal: () => number;
  reset: () => void;
}

export const CartSchema = new mongoose.Schema({
  _id: String,
  products: [ProductSchema],
  quantity: Number,
  total: Number
}, { _id: false });

CartSchema.methods.addProduct = function(product: Product): void {
  this.products.push(product);
}

CartSchema.methods.getQuantity = function(): number {
  return this.products.length;
}

CartSchema.methods.getTotal = function(product: Product): number {
  return this.products.reduce((acc: number, prb: Product) => {
    return acc + Number(prb.price['1']);
  }, 0) / 100;
}

CartSchema.methods.reset = function():void {
  this.products = [];
}

const Cart = mongoose.model<Cart>('Cart', CartSchema);
export default Cart;
