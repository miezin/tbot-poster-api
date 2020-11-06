import mongoose, { Document } from 'mongoose';

export interface UserInterface extends Document {
  userId: string;
  chatId: string;
  createdAt: Date;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  lastActivity: Date;
  language: 'en' | 'ru' | 'ua';
  isBanned: boolean;
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
  isBanned: { type: Boolean, default: false }
}, {
  _id: false,
  timestamps: {
    createdAt: 'createdAt', updatedAt: 'lastActivity' } });

const user = mongoose.model<UserInterface>('User', UserSchema);
export default user;
