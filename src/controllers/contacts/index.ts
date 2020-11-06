import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { GeneralTexts, Geo } from '../../config/enums';

export const contactsCtrl = async (ctx: SceneContextMessageUpdate): Promise<void> => {
  await ctx.replyWithHTML(GeneralTexts.contacts);
  await ctx.replyWithLocation(Geo.lat, Geo.lon);
};
