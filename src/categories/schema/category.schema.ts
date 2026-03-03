import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Player } from 'src/players/schemas/player.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  @Prop({ unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: [
      {
        name: {
          type: String,
          operation: String,
          value: Number,
        },
      },
    ],
    default: [],
  })
  events: Array<{
    name: {
      type: string;
      operation: string;
      value: number;
    };
  }>;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Player.name }],
    default: [],
  })
  players: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
