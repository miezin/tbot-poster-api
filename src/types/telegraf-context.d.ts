import { TelegrafContext } from "telegraf/typings/context";

interface ContextMessageUpdate extends TelegrafContext {
  session: any;
}