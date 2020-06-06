import User from '../models/User';
import { ContextMessageUpdate } from 'telegraf-context';
import { HookNextFunction } from 'mongoose';

export const updateUserActivity = async (ctx: ContextMessageUpdate, next: HookNextFunction) => {
  const { id } = ctx.from;
  await User.findOneAndUpdate(
    { _id: String(id) },
    { lastActivity: new Date().getTime() },
    { new: true }
  );
  return next();
};
