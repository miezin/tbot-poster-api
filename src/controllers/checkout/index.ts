import { SceneContextMessageUpdate } from "telegraf/typings/stage"
import { Context, Markup } from "telegraf"


// DUMMY!

const WizardScene = require("telegraf/scenes/wizard");
const Composer = require("telegraf/composer");

const stepHandler = new Composer()
stepHandler.hears('next', (ctx: any) => {
  ctx.reply('Step 2. Via command')
  return ctx.wizard.next()
})
stepHandler.use((ctx: any) => ctx.replyWithMarkdown('Press `Next` button or type /next'))

const superWizard = new WizardScene('checkout',
  (ctx: any) => {
    ctx.reply('Step 1')
    return ctx.wizard.next()
  },
  stepHandler,
  (ctx: any) => {
    ctx.reply('Step 3')
    return ctx.wizard.next()
  },
  (ctx: any) => {
    ctx.reply('Step 4')
    return ctx.wizard.next()
  },
  (ctx: any) => {
    ctx.reply('Done')
    return ctx.scene.leave()
  })

export default superWizard;
