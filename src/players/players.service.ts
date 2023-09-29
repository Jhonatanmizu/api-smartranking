import { Injectable, Logger, NotFoundException } from '@nestjs/common';
// DTOS
import { CreatePlayerDto } from './dtos/create-player.dto';
// Types
import { Player } from './types/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('players') private readonly playerModel: Model<Player>,
  ) {}

  players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);

  async createOrUpdatePlayer(player: CreatePlayerDto): Promise<void> {
    const { email } = player;
    const result = await this.findPlayerByEmail(email);
    if (result) {
      await this.updatePlayer(player);
      return;
    }
    await this.create(player);
  }

  async updatePlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;
    const result = await this.playerModel
      .findOneAndUpdate({ email }, { $set: createPlayerDto })
      .exec();
    return result;
  }

  async findPlayerByEmail(email: string): Promise<Player> {
    const player = this.playerModel.findOne({ email }).exec();
    if (!player) {
      throw new NotFoundException('Could not find player');
    }
    return await player;
  }

  async deletePlayer(email: string): Promise<void> {
    await this.playerModel.deleteOne({ email }).exec();
  }

  async getPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  private async create(player: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(player);
    return await createdPlayer.save();
  }
}
