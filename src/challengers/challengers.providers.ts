import { Connection } from 'mongoose';
import { DATABASE_CONNECTION } from '../shared/database/database.providers';
import { ChallengerSchema } from './schema/challenger.schema';

export const CHALLENGER_MODEL = 'CHALLENGER_MODEL';

export const ChallengersProviders = [
  {
    provide: CHALLENGER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Challenger', ChallengerSchema),
    inject: [DATABASE_CONNECTION],
  },
];
