import {
  Extra,
} from 'telegraf';


import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { GeneralTexts } from '../../config/texts';

export const contactsCtrl = async (ctx: SceneContextMessageUpdate): Promise<void> => {
  await ctx.replyWithHTML(GeneralTexts.contacts);
  await ctx.replyWithLocation(48.525781, 35.016239);
}
