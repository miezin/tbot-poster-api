import User from '../models/User';
import { ContextMessageUpdate } from 'telegraf-context';
import { HookNextFunction } from 'mongoose';

export const updateUserActivity = async (ctx: ContextMessageUpdate, next: HookNextFunction) => {
  const { id: userId, first_name, last_name, username, language_code } = ctx.from;
  const { id: chatId } = await ctx.getChat();
  await User.findOneAndUpdate(
    {
      userId: String(userId)
    },
    {
      chatId: String(chatId),
      username,
      firstName: first_name,
      lastName: last_name || '',
      language: language_code as 'en' | 'ru' | 'ua'
    }, { upsert: true });

  return next();
};
