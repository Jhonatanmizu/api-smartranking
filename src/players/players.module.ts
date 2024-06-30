import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { DatabaseModule } from '../shared/database/database.module';
import { PlayerProviders } from './players.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [PlayersController],
  providers: [PlayersService, ...PlayerProviders],
})
export class PlayersModule {}
