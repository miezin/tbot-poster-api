import User from '../models/User';
import { ContextMessageUpdate } from 'telegraf-context';
import { HookNextFunction } from 'mongoose';
import { Notifier } from '../config/notification';
import logger from './logger';

export const asyncWrapper = (fn: Function) => {
  return async function(ctx: ContextMessageUpdate, next: HookNextFunction) {
    try {
      return await fn(ctx);
    } catch (error) {
      logger.error(ctx, 'asyncWrapper error, %O', 'asyncWrapper error, %O', error);
      await ctx.reply(Notifier.error);
      return next();
    }
  }
};
