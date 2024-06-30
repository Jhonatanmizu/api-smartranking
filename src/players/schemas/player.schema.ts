import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    name: { type: 'String' },
    ranking: { type: 'String' },
    imageUrl: { type: 'String' },
    rankingPosition: { type: 'Number' },
    email: { type: 'String', unique: true },
    phoneNumber: { type: 'String', unique: true },
  },
  { timestamps: true, collection: 'players' },
);
