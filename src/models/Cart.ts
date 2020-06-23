import mongoose, {Document, Schema} from 'mongoose';
import {Product, ProductSchema} from './Product';
import {emojiMap} from "../config/emojiMap";


const groupByNameQuery = {
  $group: {
    _id: "$products.productName",
    amount: {$sum: 1},
    category: {$first: "$products.categoryName"},
    price: {$first: "$products.price"},
    total: {$sum: "$products.price"},
    id: {$first: "$products.productId"}
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

const replaceIdQueryForCategory = {
  $project: {
    category: "$_id",
    products: "$products",
    _id: false
  }
};

const replaceIdQueryForProduct = {
  $project: {
    name: "$_id",
    category: "$category",
    price: "$price",
    total: "$total",
    amount: "$amount",
    id: "$id",
    _id: false
  }
};

export interface CartResultProduct {
  name: String,
  price: Number,
  total: Number,
  amount: Number
  id: String,
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
  getGroupedProductsByCategory: () => Promise<CartResultCategory[]>
  getGroupedProducts: () => Promise<CartResultProduct[]>
  getQuantityById: (id: string) => number;
  getProductById: (id: string) => Product;
  deleteById: (id: string) => boolean;
  reset: () => void;
}

export const CartSchema = new mongoose.Schema({
  _id: String,
  products: [ProductSchema],
}, {_id: false});

CartSchema.methods.addProduct = function (product: Product): void {
  this.products.push(product);
}

CartSchema.methods.getGroupedProductsByCategory = async function (): Promise<CartResultCategory[]> {
  const groupedProducts = await mongoose.model('Cart').aggregate([
    {$match: {_id: this._id}},
    {$unwind: "$products"},
    groupByNameQuery,
    groupByCategoryQuery,
    replaceIdQueryForCategory
  ]);

  return groupedProducts;
}

CartSchema.methods.getGroupedProducts = async function (): Promise<CartResultProduct[]> {
  const groupedProducts = await mongoose.model('Cart').aggregate([
    {$match: {_id: this._id}},
    {$unwind: "$products"},
    groupByNameQuery,
    replaceIdQueryForProduct
  ])

  return groupedProducts;
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

CartSchema.methods.deleteById = function(id: string): boolean {
  const idx = this.products.findIndex(({ productId }: Product) => productId === id);
  if (~idx) {
    this.products.splice(idx, 1);
    return true;
  }

  return false;
}

CartSchema.methods.getProductById = function(id: string): Product {
  return this.products.find(({ productId }) => productId === id);
}


CartSchema.methods.reset = function (): void {
  this.products = [];
}

const Cart = mongoose.model<Cart>('Cart', CartSchema);
export default Cart;
