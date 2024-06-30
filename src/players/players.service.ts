import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private logger: Logger = new Logger('PlayersService');
  private players: Player[] = [];

  async createOrUpdatePlayer(createPlayer: CreatePlayerDto): Promise<void> {
    const exists = await this.players.find(
      (player) => player.email === createPlayer.email,
    );
    if (exists) {
      return await this.update(exists, createPlayer);
    }
    await this.create(createPlayer);
  }

  private async create(createPlayer: CreatePlayerDto): Promise<void> {
    const { name, phoneNumber, email } = createPlayer;

    const newPlayer: Player = {
      _id: uuidv4(),
      name,
      phoneNumber,
      email,
      ranking: 'A',
      rankingPosition: 1,
      imageUrl: '',
    };
    this.logger.log('create or update player', JSON.stringify(newPlayer));
    this.players.push(newPlayer);
  }

  private async update(
    targetPlayer: Player,
    createPlayer: CreatePlayerDto,
  ): Promise<void> {
    const { name } = createPlayer;

    targetPlayer.name = name;

    this.players = this.players.map((player) =>
      player._id == targetPlayer._id ? targetPlayer : player,
    );
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.players;
  }

  async findOnePlayerByEmail(email: string): Promise<Player | null> {
    const result = await this.players.find((player) => player.email == email);

    if (!result) {
      throw new NotFoundException(`Player with e-mail: ${email} not found`);
    }
    return result;
  }

  async deletePlayer(email: string): Promise<Player[]> {
    const exists = await this.findOnePlayerByEmail(email);
    if (!exists) return this.players;
    this.players = this.players.filter((player) => player.email !== email);
    return this.players;
  }
}
