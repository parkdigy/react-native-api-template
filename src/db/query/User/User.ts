/********************************************************************************************************************
 * 회원 Query Class
 * ******************************************************************************************************************/

import { MySqlQuery } from '@db_query_common';
import { Knex } from 'knex';
import { TUser$RegOs, TUser$RegType, TUser$Status } from '@db_models';
import crypt from '@common_crypt';

const tableName: Knex.TableNames = 'user';
type tableName = typeof tableName;

const makeLoginKey = (userId: number) => {
  return crypt.enc(`${userId}_${dayjs().format('YYYYMMDDHHmmssms')}_${Math.floor(Math.random() * 100)}`);
};

export default class User extends MySqlQuery<tableName> {
  Status = TUser$Status;
  RegOs = TUser$RegOs;
  RegType = TUser$RegType;

  constructor() {
    super(tableName);
  }

  /********************************************************************************************************************
   * 신규 로그인 KEY 생성
   * ******************************************************************************************************************/
  async newLoginKey(userId: number) {
    return makeLoginKey(userId);
  }

  /********************************************************************************************************************
   * UUID 생성
   * ******************************************************************************************************************/
  async newUUID(req: MyRequest) {
    let uuidVal = util.uuid();
    uuidVal = process.env.APP_ENV === 'production' ? `0${uuidVal.substring(1)}` : `d${uuidVal.substring(1)}`;
    while (await this.exists(req, { uuid: uuidVal })) {
      uuidVal = util.uuid();
      uuidVal = process.env.APP_ENV === 'production' ? `0${uuidVal.substring(1)}` : `d${uuidVal.substring(1)}`;
    }
    return uuidVal;
  }

  /********************************************************************************************************************
   * 회원 KEY 반환
   * ******************************************************************************************************************/

  getUserKey(regType: TUser$RegType, snsUserId: string) {
    return `${regType}_${snsUserId}`;
  }

  /********************************************************************************************************************
   * 회원 정보
   * ******************************************************************************************************************/
  info(req: MyRequest, userKey: string) {
    return this.getBuilder(req)
      .select(
        'id',
        'user_key',
        'uuid',
        'sns_user_id',
        'name',
        'nickname',
        'email',
        'reg_type',
        'is_push_notification',
        'reg_app_key',
        'status'
      )
      .where('user_key', userKey)
      .where('status', this.Status.On)
      .first();
  }
}

export { User };
