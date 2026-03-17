import { Inject, Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { CHALLENGER_MODEL } from './challengers.providers';
import { Model } from 'mongoose';
import { Challenger } from './interfaces/challenger.interface';
import { PlayersService } from 'src/players/players.service';
import { CategoriesService } from 'src/categories/categories.service';

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
      throw new Error('Requester not found');
    }
    const playersIds = createChallengeDto.players.map((player) =>
      String(player._id),
    );
    const somePlayerNotExists =
      await this.playersService.findManyPlayers(playersIds);

    if (somePlayerNotExists.length !== playersIds.length) {
      throw new Error('Some player not found');
    }

    const isRequesterInPlayers = playersIds.includes(requesterId);
    if (!isRequesterInPlayers) {
      throw new Error('Requester must be one of the players');
    }

    // TODO: check if requester category matches players categories

    const challenge = new this.challengerModel(createChallengeDto);
    return await challenge.save();
  }

  async findAll() {
    return await this.challengerModel.find().exec();
  }
  async findMany(ids: string[]) {
    return await this.challengerModel.find({ _id: { $in: ids } }).exec();
  }

  async findOne(id: string) {
    return await this.challengerModel.findById(id).exec();
  }

  async update(id: string, updateChallengeDto: CreateChallengeDto) {
    return await this.challengerModel
      .findByIdAndUpdate(id, updateChallengeDto, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.challengerModel.findByIdAndDelete(id).exec();
  }
}
