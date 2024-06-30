import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private logger: Logger = new Logger('PlayersService');

  constructor(
    @Inject('PLAYER_MODEL')
    private readonly playerModel: Model<Player>,
  ) {}

  async createOrUpdatePlayer(createPlayer: CreatePlayerDto): Promise<Player> {
    const exists = await this.playerModel
      .findOne({
        email: createPlayer.email,
      })
      .exec();

    if (exists) {
      return await this.update(createPlayer);
    }
    return await this.create(createPlayer);
  }

  private async create(createPlayer: CreatePlayerDto): Promise<Player> {
    const newPlayer = new this.playerModel(createPlayer);
    return await newPlayer.save();
  }

  private async update(createPlayer: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayer;

    return await this.playerModel
      .findByIdAndUpdate(
        {
          email,
        },
        { $set: createPlayer },
      )
      .exec();
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async findOnePlayerByEmail(email: string): Promise<Player | null> {
    const exists = await this.playerModel
      .findOne({
        email,
      })
      .exec();

    if (!exists) {
      throw new NotFoundException(`Player with e-mail: ${email} not found`);
    }
    return exists;
  }

  async deletePlayer(email: string): Promise<number> {
    const result = await this.playerModel.deleteOne({ email }).exec();
    return result.deletedCount;
  }
}
