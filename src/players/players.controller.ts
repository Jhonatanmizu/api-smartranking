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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Players')
@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all players' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getPlayers(): Promise<Player[]> {
    return await this.playersService.findAllPlayers();
  }

  @Get('/:_id')
  @ApiOperation({ summary: 'Get player by ID' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Player not found' })
  async getPlayersByEmail(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.findOnePlayerById(_id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create a new player' })
  @ApiResponse({ status: 201, description: 'Player created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createOrUpdatePlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<void> {
    await this.playersService.create(createPlayerDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Update an existing player' })
  @ApiResponse({ status: 200, description: 'Player updated' })
  @ApiResponse({ status: 404, description: 'Player not found' })
  async updatePlayer(
    @Param('_id', ParamsValidationPipe) _id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    await this.playersService.update(_id, updatePlayerDto);
  }

  @Delete('/:_id')
  @ApiOperation({ summary: 'Delete a player' })
  @ApiResponse({ status: 200, description: 'Player deleted' })
  @ApiResponse({ status: 404, description: 'Player not found' })
  async deletePlayer(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<void> {
    await this.playersService.deletePlayer(_id);
  }
}
