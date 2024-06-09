import { MySqlKnexUtil } from './knex';
import * as query from './query';

const db = {
  ...MySqlKnexUtil,

  // Common
  DataKey: new query.DataKey(),
  Config: new query.Config(),

  // User
  User: new query.User(),
  UserLogin: new query.UserLogin(),
  UserResign: new query.UserResign(),

  // Notice
  Notice: new query.Notice(),

  // Faq
  FaqCategory: new query.FaqCategory(),
  Faq: new query.Faq(),

  // Fcm
  FcmToken: new query.FcmToken(),
};

export default db;
