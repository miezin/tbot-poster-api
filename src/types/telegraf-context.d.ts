import { SceneContextMessageUpdate } from 'telegraf/typings/stage';

interface ContextMessageUpdate extends SceneContextMessageUpdate {
  session: any;
  wizard: any;
}
