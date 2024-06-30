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

import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { PlayersParamsValidationPipe } from './pipes/players-params-validation.pipe';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(): Promise<Player[]> {
    return await this.playersService.findAllPlayers();
  }

  @Get('/:_id')
  async getPlayersByEmail(
    @Param('_id', PlayersParamsValidationPipe) _id: string,
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
    @Param('_id', PlayersParamsValidationPipe) _id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    await this.playersService.update(_id, updatePlayerDto);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', PlayersParamsValidationPipe) _id: string,
  ): Promise<void> {
    await this.playersService.deletePlayer(_id);
  }
}
