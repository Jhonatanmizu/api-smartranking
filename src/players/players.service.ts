import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

  async create(createPlayer: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayer;
    const exists = await this.playerModel.findOne({ email }).exec();

    if (exists) {
      throw new BadRequestException(
        `Player with e-mail ${email} already exists`,
      );
    }
    const newPlayer = new this.playerModel(createPlayer);
    return await newPlayer.save();
  }

  async update(_id: string, createPlayer: CreatePlayerDto): Promise<Player> {
    await this.findOnePlayerById(_id);
    return await this.playerModel
      .findByIdAndUpdate(
        {
          _id,
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

  async findOnePlayerById(_id: string): Promise<Player> {
    const exists = await this.playerModel
      .findOne({
        _id,
      })
      .exec();

    if (!exists) {
      throw new NotFoundException(`Player with _id: ${_id} not found`);
    }
    return exists;
  }

  async deletePlayer(_id: string): Promise<number> {
    const result = await this.playerModel.deleteOne({ _id }).exec();
    return result.deletedCount;
  }
}
