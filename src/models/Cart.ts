import mongoose, {Document, Schema} from 'mongoose';
import {Product, ProductSchema} from './Product';
import {emojiMap} from "../config/emojiMap";


const groupByNameQuery = {
  $group: {
    _id: "$products.productName",
    amount: {$sum: 1},
    category: {$first: "$products.categoryName"},
    price: {$first: "$products.price"},
    total: {$sum: "$products.price"}
  }
};

const groupByCategoryQuery = {
  $group: {
    _id: "$category",
    products: {
      $push: {name: "$_id", amount: "$amount", price: "$price", total: "$total"}
    }
  }
};

const replaceIdQuery = {
  $project: {
    category: "$_id",
    products: "$products",
    _id: false
  }
};

export interface CartResultProduct {
  name: String,
  price: Number,
  total: Number,
  amount: Number
}

export interface CartResultCategory {
  category: keyof typeof emojiMap,
  products: CartResultProduct[]
}

export interface Cart extends Document {
  _id: string;
  products: Product[];

  addProduct: (product: Product) => void;
  getQuantity: () => number;
  getTotal: () => number;
  getGroupedProducts: () => Promise<CartResultCategory[]>
  getGroupedProductsQuantity: () => Promise<number>
  getQuantityById: (id: string) => number;
  reset: () => void;
}

export const CartSchema = new mongoose.Schema({
  _id: String,
  products: [ProductSchema],
}, {_id: false});

CartSchema.methods.addProduct = function (product: Product): void {
  this.products.push(product);
}

CartSchema.methods.getGroupedProducts = async function (): Promise<CartResultCategory[]> {
  const groupedProducts = await mongoose.model('Cart').aggregate([
    {$match: {_id: this._id}},
    {$unwind: "$products"},
    groupByNameQuery,
    groupByCategoryQuery,
    replaceIdQuery
  ]);

  return groupedProducts;
}

CartSchema.methods.getGroupedProductsQuantity = async function (): Promise<number> {
  const groupedProductsByName = await mongoose.model('Cart').aggregate([
    {$match: {_id: this._id}},
    {$unwind: "$products"},
    groupByNameQuery,
  ])

  return groupedProductsByName.length;
}

CartSchema.methods.getQuantity = function (): number {
  return this.products.length;
}

CartSchema.methods.getTotal = function (): number {
  return this.products.reduce((acc: number, prb: Product) => {
    return acc + prb.price;
  }, 0);
}

CartSchema.methods.getQuantityById = function (id: string): number {
  const products = this.products.filter(({ productId }: Product) => (productId === id));
  return products.length;
}

CartSchema.methods.reset = function (): void {
  this.products = [];
}

const Cart = mongoose.model<Cart>('Cart', CartSchema);
export default Cart;
