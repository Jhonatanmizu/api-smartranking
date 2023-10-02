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
// DTOS
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
// Services
import { PlayersService } from './players.service';
// Types
import { Players } from './players';
// Pipes
import PlayerValidationParams from './pipes/players-validation-params.pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() player: CreatePlayerDto) {
    return await this.playersService.createPlayer(player);
  }
  @Put('/:id')
  async updatePlayer(
    @Param('_id', PlayerValidationParams) _id: string,
    @Body() player: UpdatePlayerDto,
  ) {
    return await this.playersService.updatePlayer(_id, player);
  }

  @Get()
  async getPlayers(): Promise<Players[]> {
    return await this.playersService.getPlayers();
  }

  @Get('/:_id')
  async findPlayer(
    @Param('_id', PlayerValidationParams) _id: string,
  ): Promise<Players> {
    return await this.playersService.findPlayerById(_id);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', PlayerValidationParams) _id: string,
  ): Promise<void> {
    return await this.playersService.deletePlayer(_id);
  }
}
