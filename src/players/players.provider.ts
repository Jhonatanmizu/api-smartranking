import { Connection } from 'mongoose';
import { DATABASE_CONNECTION } from 'src/shared/database/database.providers';
import { PlayerSchema } from './schemas/player.schema';

export const PLAYER_MODEL = 'PLAYER_MODEL';

export const PlayerProviders = [
  {
    provide: PLAYER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Player', PlayerSchema),
    inject: [DATABASE_CONNECTION],
  },
];
