import { IsOptional } from 'class-validator';
import { ChallengeStatus } from '../enum/challenge-status.enum';

export class UpdateChallengeDto {
  @IsOptional()
  challengerDate: Date;

  @IsOptional()
  status: ChallengeStatus;
}
