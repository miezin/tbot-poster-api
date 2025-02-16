import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { Extra } from 'telegraf';
import { createMainKeyboard } from '../../keyboards/main';
import { default as fsWithCallbacks } from 'fs';
import { GeneralTexts } from '../../config/enums';
const fs = fsWithCallbacks.promises;

export const startCtrl = async (ctx: SceneContextMessageUpdate): Promise<void> => {
  const photo = await fs.readFile('./src/assets/logo_avatar.png');
  await ctx.replyWithPhoto({ source: photo });
  await ctx.replyWithHTML(GeneralTexts.start, Extra.markup(createMainKeyboard()));
  await ctx.scene.enter('menu');
};
