import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlayerDocument = HydratedDocument<Player>;

@Schema({ timestamps: true, collection: 'players' })
export class Player {
  @Prop()
  name: string;

  @Prop()
  ranking: string;

  @Prop()
  imageUrl: string;

  @Prop()
  rankingPosition: number;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  phoneNumber: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
