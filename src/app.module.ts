import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ChallengersModule } from './challengers/challengers.module';

@Module({
  imports: [PlayersModule, ConfigModule.forRoot(), CategoriesModule, ChallengersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
