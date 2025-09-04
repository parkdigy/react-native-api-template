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
    return this.find(req, { login_key: loginKey }).select('login_key', 'user_id', 'os');
  }

  /********************************************************************************************************************
   * 유효성 체크
   * ******************************************************************************************************************/

  async validate(req: MyRequest, data: { appKey: string; loginKey: string; userKey: string }) {
    const userInfo = await db.User.find(req, { user_key: data.userKey, status: db.User.Status.On }).select('id');
    if (userInfo) {
      const info = await this.find(req, { user_id: userInfo.id, app_key: data.appKey }).select(
        'login_key',
        'expire_date'
      );
      if (info && info.login_key === data.loginKey) {
        if (info.expire_date) {
          if (info.expire_date.getTime() > now().getTime()) {
            await this.edit(
              req,
              {
                expire_date: dayjs().add(Number(process.env.AUTH_JWT_TOKEN_EXPIRES_DAYS), 'days').toDate(),
                update_date: now(),
              },
              { user_id: userInfo.id, app_key: data.appKey }
            );
            return true;
          } else {
            await this.remove(req, { user_id: userInfo.id, app_key: data.appKey });
            return false;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

export { UserLogin };
