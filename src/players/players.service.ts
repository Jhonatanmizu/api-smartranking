import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// DTOS
import { CreatePlayerDto } from './dtos/create-player.dto';
// Types
import { Player } from './types/player.interface';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('players') private readonly playerModel: Model<Player>,
  ) {}

  players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(player: CreatePlayerDto): Promise<Player> {
    const { email } = player;
    const result = await this.findPlayerByEmail(email);
    if (result) {
      throw new BadRequestException(
        `User already exists with email: ${player.email}`,
      );
    }
    const createdPlayer = new this.playerModel(player);
    return await createdPlayer.save();
  }

  async updatePlayer(_id: string, player: UpdatePlayerDto): Promise<Player> {
    const result = await this.playerModel.findOne({ _id });
    if (!result) {
      throw new NotFoundException(`Player ${_id} not found`);
    }
    return await this.playerModel
      .findOneAndUpdate({ _id }, { $set: player })
      .exec();
  }

  async findPlayerByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec();
    if (!player) {
      throw new NotFoundException('Could not find player');
    }
    return player;
  }

  async findPlayerById(_id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id }).exec();
    if (!player) {
      throw new NotFoundException('Could not find player');
    }
    return player;
  }

  async deletePlayer(_id: string): Promise<void> {
    await this.findPlayerById(_id);
    await this.playerModel.deleteOne({ _id }).exec();
  }

  async getPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }
}
