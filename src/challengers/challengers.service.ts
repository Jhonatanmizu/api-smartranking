import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { CHALLENGER_MODEL } from './challengers.providers';
import { Model } from 'mongoose';
import { Challenger } from './interfaces/challenger.interface';
import { PlayersService } from 'src/players/players.service';
import { CategoriesService } from 'src/categories/categories.service';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './enum/challenge-status.enum';

@Injectable()
export class ChallengersService {
  constructor(
    @Inject(CHALLENGER_MODEL)
    private readonly challengerModel: Model<Challenger>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createChallenge(createChallengeDto: CreateChallengeDto) {
    const requesterId: string = String(createChallengeDto.requester._id);
    const requesterExists =
      await this.playersService.findOnePlayerById(requesterId);

    if (!requesterExists) {
      throw new NotFoundException('Requester not found');
    }

    const playersIds = createChallengeDto.players.map((player) =>
      String(player._id),
    );

    const playersExist = await this.playersService.findManyPlayers(playersIds);

    if (playersExist.length !== playersIds.length) {
      throw new BadRequestException('Some players were not found');
    }

    const isRequesterInPlayers = playersIds.includes(requesterId);
    if (!isRequesterInPlayers) {
      throw new BadRequestException('Requester must be one of the players');
    }

    const playerCategory =
      await this.categoriesService.playerCategory(requesterId);

    if (!playerCategory) {
      throw new BadRequestException('Requester must be in a category');
    }

    const challenge = new this.challengerModel(createChallengeDto);
    challenge.category = playerCategory.name;
    challenge.requestedAt = new Date();
    challenge.status = ChallengeStatus.PENDING;

    return await challenge.save();
  }

  async findAll() {
    return await this.challengerModel
      .find()
      .populate('players')
      .populate('requester')
      .populate('match')
      .exec();
  }

  async findChallengesByPlayer(playerId: string) {
    return await this.challengerModel
      .find()
      .where('players')
      .in([playerId])
      .populate('players')
      .populate('requester')
      .populate('match')
      .exec();
  }

  async findMany(ids: string[]) {
    return await this.challengerModel.find({ _id: { $in: ids } }).exec();
  }

  async findOne(id: string) {
    const challenge = await this.challengerModel.findById(id).exec();
    if (!challenge) {
      throw new NotFoundException(`Challenge with id ${id} not found`);
    }
    return challenge;
  }

  async update(id: string, updateChallengeDto: UpdateChallengeDto) {
    const exists = await this.challengerModel.findById(id).exec();
    if (!exists) {
      throw new NotFoundException('Challenge not found');
    }

    const updateData: any = { ...updateChallengeDto };
    if (updateChallengeDto.status) {
      updateData.answeredAt = new Date();
    }

    return await this.challengerModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();
  }

  async delete(id: string) {
    const exists = await this.challengerModel.findById(id).exec();
    if (!exists) {
      throw new NotFoundException('Challenge not found');
    }
    return await this.challengerModel.findByIdAndDelete(id).exec();
  }
}
