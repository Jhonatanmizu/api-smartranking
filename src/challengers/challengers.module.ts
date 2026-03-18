import { Module } from '@nestjs/common';
import { ChallengersService } from './challengers.service';
import { ChallengersController } from './challengers.controller';
import { MatchesProviders } from './match.providers';
import { ChallengersProviders } from './challengers.providers';
import { PlayersModule } from '../players/players.module';
import { CategoriesModule } from '../categories/categories.module';
import { DatabaseModule } from '../shared/database/database.module';
import { MatchesService } from './matches.service';

@Module({
  providers: [
    ChallengersService,
    MatchesService,
    ...MatchesProviders,
    ...ChallengersProviders,
  ],
  controllers: [ChallengersController],
  imports: [PlayersModule, CategoriesModule, DatabaseModule],
  exports: [ChallengersService, MatchesService],
})
export class ChallengersModule {}
