import { IsOptional } from 'class-validator';
import { ChallengeStatus } from '../enum/challenge-status.enum';

export class UpdateChallengeDto {
  @IsOptional()
  challengeDate: Date;

  @IsOptional()
  status: ChallengeStatus;

  @IsOptional()
  match: string;
}
