import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ParamsValidationPipe } from 'src/shared/pipes';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(): Promise<Player[]> {
    return await this.playersService.findAllPlayers();
  }

  @Get('/:_id')
  async getPlayersByEmail(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.findOnePlayerById(_id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createOrUpdatePlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<void> {
    await this.playersService.create(createPlayerDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('_id', ParamsValidationPipe) _id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    await this.playersService.update(_id, updatePlayerDto);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<void> {
    await this.playersService.deletePlayer(_id);
  }
}
