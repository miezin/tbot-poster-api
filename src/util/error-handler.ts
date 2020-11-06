import { ContextMessageUpdate } from 'telegraf-context';
import { Notifier } from '../config/notification';
import logger from './logger';

export const errorHandler = async (error: string, ctx: ContextMessageUpdate): Promise<void> => {
  logger.error(ctx, 'error, %O', error);
  await ctx.reply(Notifier.error);
};
