import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(@Query('email') email: string): Promise<Player[] | Player> {
    if (email) {
      return await this.playersService.findOnePlayerByEmail(email);
    }
    return await this.playersService.findAllPlayers();
  }

  @Post()
  async createOrUpdatePlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<void> {
    await this.playersService.createOrUpdatePlayer(createPlayerDto);
  }

  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<void> {
    await this.playersService.deletePlayer(email);
  }
}
