import { MySqlKnexUtil } from './knex';
import * as query from './query';

const db = {
  ...MySqlKnexUtil,

  User: new query.User(),
};

export default db;
