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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Challengers')
@Controller('api/v1/challengers')
export class ChallengersController {
  constructor(
    private readonly challengersService: ChallengersService,
    private readonly matchesService: MatchesService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create a new challenge' })
  @ApiResponse({ status: 201, description: 'Challenge created' })
  async createChallenger(@Body() createChallengeDto: CreateChallengeDto) {
    return await this.challengersService.createChallenge(createChallengeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all challenges' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll(@Query('playerId') playerId: string) {
    if (playerId) {
      return await this.challengersService.findChallengesByPlayer(playerId);
    }
    return await this.challengersService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get challenge by ID' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  async findOne(@Param('id') id: string) {
    return await this.challengersService.findOne(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a challenge' })
  @ApiResponse({ status: 200, description: 'Challenge updated' })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  async update(
    @Param('id') id: string,
    @Body(ChallengerStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
  ) {
    return await this.challengersService.update(id, updateChallengeDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a challenge' })
  @ApiResponse({ status: 200, description: 'Challenge deleted' })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  async delete(@Param('id') id: string) {
    return await this.challengersService.delete(id);
  }

  @Post('/:challenge/match')
  @ApiOperation({ summary: 'Register a match result for a challenge' })
  @ApiResponse({ status: 201, description: 'Match registered' })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  async createMatch(
    @Param('challenge') challenge: string,
    @Body(ValidationPipe) createMatchDto: CreateMatchDto,
  ) {
    return await this.matchesService.createMatch(challenge, createMatchDto);
  }
}
