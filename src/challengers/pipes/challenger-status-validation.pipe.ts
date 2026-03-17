import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../enum/challenge-status.enum';

export class ChallengerStatusValidationPipe implements PipeTransform {
  readonly acceptedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`${status} é um status inválido`);
    }

    return value;
  }

  private isValidStatus(status: any) {
    const idx = this.acceptedStatus.indexOf(status);
    return idx !== -1;
  }
}
