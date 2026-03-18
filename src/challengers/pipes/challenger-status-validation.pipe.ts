import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../enum/challenge-status.enum';

export class ChallengerStatusValidationPipe implements PipeTransform {
  readonly acceptedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: unknown) {
    if (typeof value !== 'object' || value === null || !('status' in value)) {
      return value;
    }

    const statusObj = value as { status: string };
    const status = statusObj.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`${status} is an invalid status`);
    }

    return value;
  }

  private isValidStatus(status: string) {
    const idx = this.acceptedStatus.indexOf(status as ChallengeStatus);
    return idx !== -1;
  }
}
