/********************************************************************************************************************
 * FCM 토큰 Query Class
 * ******************************************************************************************************************/

import { MySqlQuery } from '@db_query_common';
import { Knex } from 'knex';
import { TFcmToken$Os } from '@db_models';

const tableName: Knex.TableNames = 'fcm_token';
type tableName = typeof tableName;

export default class FcmToken extends MySqlQuery<tableName> {
  Os = TFcmToken$Os;

  constructor() {
    super(tableName);
  }

  /********************************************************************************************************************
   * FCM 토큰 등록/수정
   * ******************************************************************************************************************/

  async addEdit(
    req: MyRequest,
    id: string,
    userId: number,
    os: TFcmToken$Os,
    osVersion: string,
    buildNumber: string,
    deviceModel: string,
    deviceManufacturer: string
  ) {
    const info = await this.find(req, { id }).select('user_id');
    if (info) {
      if (info.user_id !== userId) {
        await this.edit(
          req,
          { user_id: userId, os_version: osVersion, build_number: buildNumber, update_date: now() },
          { id }
        );
      }
    } else {
      await this.add(req, {
        id,
        user_id: userId,
        os,
        os_version: osVersion,
        build_number: buildNumber,
        device_model: deviceModel,
        device_manufacturer: deviceManufacturer,
        create_date: now(),
        update_date: now(),
      });
    }
  }

  /********************************************************************************************************************
   * 회원 토큰 목록
   * ******************************************************************************************************************/

  listOfUser(req: MyRequest, userId: number) {
    return this.getBuilder(req).select('id', 'os').where('user_id', userId);
  }
}

export { FcmToken };
