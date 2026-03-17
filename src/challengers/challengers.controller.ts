import { Controller } from '@nestjs/common';
import { ChallengersService } from './challengers.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';

@Controller('challengers')
export class ChallengersController {
  constructor(private readonly challengersService: ChallengersService) {}

  async createChallenger(createChallengeDto: CreateChallengeDto) {}
}
