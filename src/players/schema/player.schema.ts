import mongoose from 'mongoose';

export const playerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phoneNumber: { type: String, unique: true },
    name: { type: String, null: false },
    ranking: { type: String, null: false },
    rankingPosition: { type: Number, null: false },
    photoUrl: { type: Number },
  },
  { timestamps: true, collection: 'players' },
);
