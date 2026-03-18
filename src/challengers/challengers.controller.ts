import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengersService } from './challengers.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengerStatusValidationPipe } from './pipes/challenger-status-validation.pipe';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dtos/create-match.dto';

@Controller('api/v1/challengers')
export class ChallengersController {
  constructor(
    private readonly challengersService: ChallengersService,
    private readonly matchesService: MatchesService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenger(@Body() createChallengeDto: CreateChallengeDto) {
    return await this.challengersService.createChallenge(createChallengeDto);
  }

  @Get()
  async findAll(@Query('playerId') playerId: string) {
    if (playerId) {
      return await this.challengersService.findChallengesByPlayer(playerId);
    }
    return await this.challengersService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.challengersService.findOne(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body(ChallengerStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
  ) {
    return await this.challengersService.update(id, updateChallengeDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.challengersService.delete(id);
  }

  @Post('/:challenge/match')
  async createMatch(
    @Param('challenge') challenge: string,
    @Body(ValidationPipe) createMatchDto: CreateMatchDto,
  ) {
    return await this.matchesService.createMatch(challenge, createMatchDto);
  }
}
