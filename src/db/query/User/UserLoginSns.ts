/********************************************************************************************************************
 * 회원 로그인 SNS 정보 Query Class
 * ******************************************************************************************************************/

import { MySqlQuery } from '@db_query_common';
import { Knex } from 'knex';
import { TUserLoginSns$Type } from '@db_models';

const tableName: Knex.TableNames = 'user_login_sns';
type tableName = typeof tableName;

export default class UserLoginSns extends MySqlQuery<tableName> {
  Type = TUserLoginSns$Type;

  constructor() {
    super(tableName);
  }

  /********************************************************************************************************************
   * 정보
   * ******************************************************************************************************************/

  info(req: MyRequest, type: TUserLoginSns$Type, snsUserId: string) {
    return this.find(req, { type, sns_user_id: snsUserId }).select(
      'sns_access_token',
      'sns_access_token_exp',
      'sns_refresh_token',
      'sns_refresh_token_exp'
    );
  }
}

export { UserLoginSns };
