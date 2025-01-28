import { Module } from '@nestjs/common';
import { ChallengersService } from './challengers.service';
import { ChallengersController } from './challengers.controller';

@Module({
  providers: [ChallengersService],
  controllers: [ChallengersController]
})
export class ChallengersModule {}
