import mongoose, { Document } from 'mongoose';

export interface Ingredient {
  ingredientId: string;
  ingredientUnit: string;
  ingredientName: string;
}

export interface ProductInterface {
  categoryName: string;
  isHidden: boolean;
  categoryId: string;
  photo: string;
  photoOrigin: string,
  price: number,
  productId: string;
  productName: string;
  out: number;
  ingredients: Ingredient[];
}

export const ProductSchema = new mongoose.Schema({
  categoryName:  String,
  isHidden: Boolean,
  categoryId: String,
  photo: String,
  photoOrigin: String,
  price: Number,
  productId: String,
  productName: String,
  out: Number,
  ingredients: [{
    ingredientId: String,
    ingredientUnit: String,
    ingredientName: String
  }]
}, { _id: false });

export interface ProductSchemaModel extends ProductInterface, Document {}

const product = mongoose.model<ProductSchemaModel>('Product', ProductSchema);

export default product;
