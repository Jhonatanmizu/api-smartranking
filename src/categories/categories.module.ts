import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { CategoriesController } from './categories.controller';
import { CategoriesProviders } from './categories.providers';
import { CategoriesService } from './categories.service';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [DatabaseModule, PlayersModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, ...CategoriesProviders],
})
export class CategoriesModule {}
