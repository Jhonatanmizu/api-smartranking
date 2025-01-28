import { Match } from './match.interface';
import { Document } from 'mongoose';
import { Category } from 'src/categories/interfaces/category.interface';
import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from '../enum/challenge-status.enum';

export interface Challenger extends Document {
  challengeDate: Date;
  createdAt: Date;
  answeredAt: Date;
  requestedAt: Date;
  requester: Player;
  category: Category;
  players: Array<Player>;
  match: Match;
  status: ChallengeStatus;
}
