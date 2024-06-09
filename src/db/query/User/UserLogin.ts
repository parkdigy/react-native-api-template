/********************************************************************************************************************
 * 회원 탈퇴 Query Class
 * ******************************************************************************************************************/

import { MySqlQuery } from '@db_query_common';
import { Knex } from 'knex';
import { TUserLogin$Os } from '@db_models';

const tableName: Knex.TableNames = 'user_login';
type tableName = typeof tableName;

export default class UserLogin extends MySqlQuery<tableName> {
  Os = TUserLogin$Os;

  constructor() {
    super(tableName);
  }

  /********************************************************************************************************************
   * 정보
   * ******************************************************************************************************************/

  info(req: MyRequest, loginKey: string) {
    return this.find(req, { login_key: loginKey }).select(
      'login_key',
      'user_id',
      'os',
      'sns_access_token',
      'sns_access_token_exp',
      'sns_refresh_token',
      'sns_refresh_token_exp'
    );
  }

  /********************************************************************************************************************
   * 유효성 체크
   * ******************************************************************************************************************/

  async validate(req: MyRequest, loginKey: string) {
    const info = await this.find(req, { login_key: loginKey }).select('expire_date');
    if (info) {
      if (info.expire_date) {
        if (info.expire_date.getTime() > now().getTime()) {
          await this.edit(
            req,
            {
              expire_date: dayjs().add(Number(process.env.AUTH_JWT_TOKEN_EXPIRES_DAYS), 'days').toDate(),
              update_date: now(),
            },
            { login_key: loginKey }
          );
          return true;
        } else {
          await this.remove(req, { login_key: loginKey });
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}

export { UserLogin };
