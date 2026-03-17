import * as mongoose from 'mongoose';
import { ChallengeStatus } from '../enum/challenge-status.enum';

export const ChallengerSchema = new mongoose.Schema(
  {
    challengeDate: { type: Date },
    status: { type: String, enum: ChallengeStatus },
    answeredAt: { type: Date },
    requestedAt: { type: Date },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    category: { type: String },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  },
  { timestamps: true, collection: 'challengers' },
);
