import mongoose, { Document } from 'mongoose';
import { CartResultProduct } from './Cart';

export interface Order extends Document {
  userId: string;
  status: string;
  firstName: string;
  phone: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  products: CartResultProduct[];
}

export const OrderSchema = new mongoose.Schema({
  userId: String,
  chatId: String,
  status: String,
  firstName: String,
  phone: String,
  comment: String,
  createdAt: Date,
  updatedAt: Date,
  products: [{
    name: String,
    price: Number,
    total: Number,
    amount: Number,
    id: String
  }]
}, {
    timestamps: {
      createdAt: 'createdAt', updatedAt: 'updatedAt' } })

const user = mongoose.model<Order>('Order', OrderSchema);
export default user;
