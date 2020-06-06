import mongoose, { Document } from 'mongoose';
import { emojiMap } from '../config/emojiMap';

export interface Price {
  [key: string]: string;
}

export interface Profit {
  [key: string]: string;
}

export interface Spot {
  spot_id: string;
  price: string;
  profit: string;
  profit_netto: string;
  visible: string;
}

export interface Product extends Document {
  barcode: string;
  category_name:  keyof typeof emojiMap;
  unit: string;
  cost: string;
  cost_netto: string;
  fiscal: string;
  hidden: string;
  menu_category_id: string;
  workshop: string;
  nodiscount: string;
  photo: string;
  photo_origin: string,
  price: Price,
  product_code: string;
  product_id: string;
  product_name: string;
  profit: Profit,
  sort_order:string;
  tax_id: string;
  product_tax_id: string;
  type: string;
  weight_flag: string;
  color: string;
  spots: Spot[],
  ingredient_id: string;
  cooking_time: string;
  out: number
}

export const ProductSchema = new mongoose.Schema({
  barcode: String,
  category_name: String,
  unit: String,
  cost: String,
  cost_netto: String,
  fiscal: String,
  hidden: String,
  menu_category_id: String,
  workshop: String,
  nodiscount: String,
  photo: String,
  photo_origin: String,
  price: {'1': String},
  product_code: String,
  product_id: String,
  product_name: String,
  profit: {String: String},
  sort_order: String,
  tax_id: String,
  product_tax_id: String,
  type: String,
  weight_flag: String,
  color: String,
  spots: [{
    spot_id: String,
    price: String,
    profit: String,
    profit_netto: String,
    visible: String,
  }],
  ingredient_id: String,
  cooking_time: String,
  out: Number
}, { _id: false })

const product = mongoose.model<Product>('Product', ProductSchema);
export default product;
