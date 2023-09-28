import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { Players } from './players';
import { playerSchema } from './schema/player.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService, Players],
  imports: [
    MongooseModule.forFeature([{ name: 'players', schema: playerSchema }]),
  ],
})
export class PlayersModule {}
