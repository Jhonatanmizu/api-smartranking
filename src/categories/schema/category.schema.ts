import mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema(
  {
    description: { type: String, unique: true },
    category: { type: String, unique: true, null: false },
    events: [
      {
        name: { type: String },
        operation: { type: String },
        value: { type: Number },
      },
    ],
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'player',
      },
    ],
  },
  { timestamps: true, collection: 'categories' },
);
