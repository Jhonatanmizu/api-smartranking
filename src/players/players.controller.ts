import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
// DTOS
import { CreatePlayerDto } from './dtos/create-player.dto';
// Services
import { PlayersService } from './players.service';
// Types
import { Players } from './players';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrUpdatePlayer(@Body() player: CreatePlayerDto) {
    await this.playersService.createOrUpdatePlayer(player);
  }

  @Get()
  async getPlayers(): Promise<Players[]> {
    return await this.playersService.getPlayers();
  }

  @Get()
  async findPlayer(@Query('email') email: string): Promise<Players> {
    return await this.playersService.findPlayerByEmail(email);
  }

  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<void> {
    await this.playersService.deletePlayer(email);
  }
}
