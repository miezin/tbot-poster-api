import mongoose, { Document } from 'mongoose';
import { ActionState } from "actionState";

export interface User extends Document {
  _id: string;
  created: number;
  username: string;
  name: string;
  lastActivity: number;
  language: 'en' | 'ru' | 'ua';
  sessionData: {
    __scenes: {
      current: string
    },
    state: ActionState
  }
}

export const UserSchema = new mongoose.Schema({
  _id: String,
  created: Number,
  username: String,
  firstName: String,
  lastName: String,
  phone: String,
  lastActivity: Number,
  language: String,
  sessionData: {
    __scenes: {
      current: String
    },
    state: Object
  }
}, { _id: false })

const User = mongoose.model<User>('User', UserSchema);
export default User;
