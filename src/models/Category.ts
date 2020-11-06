import mongoose, { Document } from 'mongoose';

export interface CategoryInterface {
  categoryId: string;
  categoryName: string;
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
}, { _id: false });

export interface CategorySchemaModel extends CategoryInterface, Document {}

const category = mongoose.model<CategorySchemaModel>('Category', CategorySchema);

export default category;
