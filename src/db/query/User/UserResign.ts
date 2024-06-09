/********************************************************************************************************************
 * 회원 탈퇴 Query Class
 * ******************************************************************************************************************/

import { MySqlQuery } from '@db_query_common';
import { Knex } from 'knex';

const tableName: Knex.TableNames = 'user_resign';
type tableName = typeof tableName;

export default class UserResign extends MySqlQuery<tableName> {
  constructor() {
    super(tableName);
  }
}

export { UserResign };
