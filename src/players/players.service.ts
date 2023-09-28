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
    @InjectModel('player') private readonly playerModel: Model<Player>,
  ) {}
  players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);

  async createOrUpdatePlayer(player: CreatePlayerDto): Promise<void> {
    const { email } = player;
    const result = await this.playerModel.findOne({ email }).exec();
    if (result) await this.updatePlayer(result, player);
    await this.create(player);
  }

  async updatePlayer(
    targetPlayer: Player,
    createPlayerDto: CreatePlayerDto,
  ): Promise<void> {
    const { name } = createPlayerDto;
    targetPlayer.name = name;
  }

  async findPlayerByEmail(email: string): Promise<Player> {
    const player = this.players.find((player) => player.email === email);
    if (!player) {
      throw new NotFoundException('Could not find player');
    }
    return await player;
  }

  async deletePlayer(email: string): Promise<void> {
    const result = await this.findPlayerByEmail(email);
    this.players = this.players.filter(
      (player) => player.email !== result.email,
    );
  }

  async getPlayers(): Promise<Player[]> {
    return await this.players;
  }

  private async create(player: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(player);
    return await createdPlayer.save();
  }
}
