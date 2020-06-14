import mongoose, { Document } from 'mongoose';
import { emojiMap } from '../config/emojiMap';

export interface Category {
  categoryId: string;
  categoryName: keyof typeof emojiMap;
  photo: string;
  photoOrigin: string;
  isHidden: boolean;
  parentCategory: string;
}

export const CategorySchema = new mongoose.Schema({
  categoryId: String,
  categoryName: String,
  photo: String,
  photoOrigin: String,
  isHidden: Boolean
}, { _id: false })

export interface CategorySchemaModel extends Category, Document {}

const category = mongoose.model<CategorySchemaModel>('Category', CategorySchema);

export default category;
