import { Category } from 'src/categories/interfaces/category.interface';
import { Player } from 'src/players/interfaces/player.interface';
import { Result } from './result.interface';

export interface Match extends Document {
  category: Category;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}
