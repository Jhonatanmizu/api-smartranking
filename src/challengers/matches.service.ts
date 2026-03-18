import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { MATCH_MODEL } from './match.providers';
import { Match } from './interfaces/match.interface';
import { CreateMatchDto } from './dtos/create-match.dto';
import { ChallengersService } from './challengers.service';
import { ChallengeStatus } from './enum/challenge-status.enum';

@Injectable()
export class MatchesService {
  constructor(
    @Inject(MATCH_MODEL)
    private readonly matchModel: Model<Match>,
    private readonly challengersService: ChallengersService,
  ) {}

  async createMatch(
    challengeId: string,
    createMatchDto: CreateMatchDto,
  ): Promise<Match> {
    const challenge = await this.challengersService.findOne(challengeId);

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    const winnerIsOnTheChallenge = challenge.players.some(
      (player) => String(player._id) === String(createMatchDto.def._id),
    );

    if (!winnerIsOnTheChallenge) {
      throw new BadRequestException('The winner must be on the challenge');
    }

    const newMatch = new this.matchModel(createMatchDto);
    newMatch.category = challenge.category;
    newMatch.players = challenge.players;

    try {
      const matchSaved = await newMatch.save();

      await this.challengersService.update(challengeId, {
        status: ChallengeStatus.FINISHED,
        match: matchSaved._id,
      } as any);

      return matchSaved;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Match[]> {
    return await this.matchModel
      .find()
      .populate('players')
      .populate('def')
      .exec();
  }
}
