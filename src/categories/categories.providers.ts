import { Connection } from 'mongoose';
import { DATABASE_CONNECTION } from 'src/shared/database/database.providers';
import { CategorySchema } from './schema/category.schema';

export const CATEGORY_MODEL = 'CATEGORY_MODEL';

export const CategoriesProviders = [
  {
    provide: CATEGORY_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Category', CategorySchema),
    inject: [DATABASE_CONNECTION],
  },
];
