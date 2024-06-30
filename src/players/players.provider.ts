import { Connection } from 'mongoose';
import { PlayerSchema } from './schemas/player.schema';

export const PlayerProviders = [
  {
    provide: 'PLAYER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Player', PlayerSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
