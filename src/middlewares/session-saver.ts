import { Mongoose } from "mongoose";
import { ContextMessageUpdate } from "telegraf-context";

export const sessionSaver = (mongoose: Mongoose) => {
  return async (ctx: ContextMessageUpdate, next: () => Promise<void>) => {
    const { db } = mongoose.connection;
    const collection = db.collection('session');
    if (!Object.keys(ctx.session).length) {
      const session = await collection.findOne({ key: ctx.from.id });
      if (session) {
        ctx.session = session.data;
      }
    }

    await next();
    await collection.updateOne(
      {
        key: ctx.from.id
       },
      {
        $set: { data: ctx.session,
          firstName: ctx.from.first_name,
          username: ctx.from.username
        }
      },
      { upsert: true }
      );
  }
}
