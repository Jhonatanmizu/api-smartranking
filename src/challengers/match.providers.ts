import { Connection } from 'mongoose';
import { DATABASE_CONNECTION } from '../shared/database/database.providers';
import { MatchSchema } from './schema/match.schema';

export const MATCH_MODEL = 'MATCH_MODEL';

export const MatchesProviders = [
  {
    provide: MATCH_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Match', MatchSchema),
    inject: [DATABASE_CONNECTION],
  },
];
