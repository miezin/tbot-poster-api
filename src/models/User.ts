import mongoose, { Document } from 'mongoose';

export interface User extends Document {
  userId: string;
  chatId: string;
  createdAt: Date;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  lastActivity: Date;
  language: 'en' | 'ru' | 'ua';
}

export const UserSchema = new mongoose.Schema({
  userId: String,
  chatId: String,
  createdAt: Date,
  username: String,
  firstName: String,
  lastName: String,
  phone: String,
  lastActivity: Date,
  language: String,
}, {
    _id: false,
    timestamps: {
      createdAt: 'createdAt', updatedAt: 'lastActivity' } })

const user = mongoose.model<User>('User', UserSchema);
export default user;
