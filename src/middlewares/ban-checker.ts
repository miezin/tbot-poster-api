import User from '../models/User';
import { ContextMessageUpdate } from 'telegraf-context';
import { HookNextFunction } from 'mongoose';
import { Notifier } from '../config/notification';

export const isUserBanned = async (ctx: ContextMessageUpdate, next: HookNextFunction) => {
  const { id: userId } = ctx.from;
  const user = await User.findOne({userId: String(userId)});

  if (user && user.isBanned) {
    return ctx.reply(Notifier.bann);
  }

  return next();
};
