import mongoose, { Document } from 'mongoose';
import { ProductInterface, ProductSchema } from './Product';

const groupByNameQuery = {
  $group: {
    _id: '$products.productName',
    amount: { $sum: 1 },
    category: { $first: '$products.categoryName' },
    price: { $first: '$products.price' },
    total: { $sum: '$products.price' },
    id: { $first: '$products.productId' }
  }
};

const groupByCategoryQuery = {
  $group: {
    _id: '$category',
    products: {
      $push: { name: '$_id', amount: '$amount', price: '$price', total: '$total' }
    }
  }
};

const replaceIdQueryForCategory = {
  $project: {
    category: '$_id',
    products: '$products',
    _id: false
  }
};

const replaceIdQueryForProduct = {
  $project: {
    name: '$_id',
    category: '$category',
    price: '$price',
    total: '$total',
    amount: '$amount',
    id: '$id',
    _id: false
  }
};

export interface CartResultProduct {
  name: string;
  price: number;
  total: number;
  amount: number;
  id: string;
}

export interface CartResultCategory {
  category: string,
  products: CartResultProduct[]
}

export interface CartInterface extends Document {
  _id: string;
  products: ProductInterface[];

  addProduct: (product: ProductInterface) => void;
  getQuantity: () => number;
  getQuantityById: (id: string) => number;
  getTotal: () => number;
  getGroupedProductsByCategory: () => Promise<CartResultCategory[]>
  getGroupedProducts: () => Promise<CartResultProduct[]>
  addOneMoreProduct: (id: string) => void;
  deleteById: (id: string) => void;
  deleteAllById: (id: string) => void;
  reset: () => void;
}

export const CartSchema = new mongoose.Schema({
  _id: String,
  products: [ProductSchema]
}, { _id: false });

CartSchema.methods.addProduct = function (product: ProductInterface): void {
  this.products.push(product);
};

CartSchema.methods.getGroupedProductsByCategory = async function (): Promise<CartResultCategory[]> {
  const groupedProducts = await mongoose.model('Cart').aggregate([
    { $match: { _id: this._id } },
    { $unwind: '$products' },
    groupByNameQuery,
    { $sort: { _id: 1 } },
    groupByCategoryQuery,
    { $sort: { _id: 1 } },
    replaceIdQueryForCategory
  ]);

  return groupedProducts;
};

CartSchema.methods.getGroupedProducts = async function (): Promise<CartResultProduct[]> {
  const groupedProducts = await mongoose.model('Cart').aggregate([
    { $match: { _id: this._id } },
    { $unwind: '$products' },
    groupByNameQuery,
    { $sort: { _id: 1, category: 1 } },
    replaceIdQueryForProduct
  ]);

  return groupedProducts;
};

CartSchema.methods.getQuantity = function (): number {
  return this.products.length;
};

CartSchema.methods.getTotal = function (): number {
  return this.products.reduce((acc: number, prb: ProductInterface) => {
    return acc + prb.price;
  }, 0);
};

CartSchema.methods.getQuantityById = function (id: string): number {
  const products = this.products.filter(({ productId }: ProductInterface) => (productId === id));
  return products.length;
};

CartSchema.methods.deleteById = function (id: string): void {
  const idx = this.products.findIndex(({ productId }: ProductInterface) => productId === id);
  this.products.splice(idx, 1);
};

CartSchema.methods.deleteAllById = function (id: string): void {
  const editedProducts = this.products.filter(({ productId }: ProductInterface) => productId !== id);
  this.products = editedProducts;
};

CartSchema.methods.addOneMoreProduct = function (id: string): void {
  const product = this.products.find(({ productId }: ProductInterface) => productId === id);
  this.addProduct(product);
};


CartSchema.methods.reset = function (): void {
  this.products = [];
};

const Cart = mongoose.model<CartInterface>('Cart', CartSchema);
export default Cart;
