import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './interfaces/player.interface';
import { PLAYER_MODEL } from './players.provider';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @Inject(PLAYER_MODEL)
    private readonly playerModel: Model<Player>,
  ) {}

  async create(createPlayer: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayer;
    this.logger.log(`create player: ${email}`);
    const exists = await this.playerModel.findOne({ email }).exec();

    if (exists) {
      throw new BadRequestException(
        `Player with e-mail ${email} already exists`,
      );
    }
    const newPlayer = new this.playerModel(createPlayer);
    return await newPlayer.save();
  }

  async update(_id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    this.logger.log(`update player: ${_id}`);
    await this.findOnePlayerById(_id);
    return await this.playerModel
      .findByIdAndUpdate(
        {
          _id,
        },
        { $set: updatePlayerDto },
      )
      .exec();
  }

  async findAllPlayers(): Promise<Player[]> {
    this.logger.log('find all players');
    return await this.playerModel.find().exec();
  }

  async findOnePlayerByEmail(email: string): Promise<Player | null> {
    this.logger.log(`find player by email: ${email}`);
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
    this.logger.log(`find player by id: ${_id}`);
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
    this.logger.log(`delete player: ${_id}`);
    await this.findOnePlayerById(_id);
    const result = await this.playerModel.deleteOne({ _id }).exec();
    return result.deletedCount;
  }

  async findManyPlayers(ids: string[]): Promise<Player[]> {
    this.logger.log(`find many players: ${JSON.stringify(ids)}`);
    return await this.playerModel.find({ _id: { $in: ids } }).exec();
  }
}
