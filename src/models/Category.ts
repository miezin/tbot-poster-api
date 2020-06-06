import mongoose, { Document } from 'mongoose';
import { emojiMap } from '../config/emojiMap';


export interface Category extends Document {
  category_id: string;
  category_name: keyof typeof emojiMap;
  category_photo: string;
  category_photo_origin: string;
  parent_category: string;
  category_color: string;
  category_hidden: string;
  sort_order: string;
  fiscal: string;
  nodiscount: string;
  tax_id: string;
  left: string;
  right: string;
  level: string;
  category_tag: null;
  visible: [];
}

export const ProductSchema = new mongoose.Schema({
  category_id: String,
  category_name: String,
  category_photo: String,
  category_photo_origin: String,
  parent_category: String,
  category_color: String,
  category_hidden: String,
  sort_order: String,
  fiscal: String,
  nodiscount: String,
  tax_id: String,
  left: String,
  right: String,
  level: String,
  category_tag: String,
  visible: []
}, { _id: false })

const product = mongoose.model<Category>('Category', ProductSchema);
export default product;
