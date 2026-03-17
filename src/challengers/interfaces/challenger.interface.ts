import { Match } from './match.interface';
import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from '../enum/challenge-status.enum';

export interface Challenger extends Document {
  challengeDate: Date;
  status: ChallengeStatus;
  answeredAt: Date;
  requestedAt: Date;
  requester: Player;
  category: string;
  players: Array<Player>;
  match: Match;
}
