/********************************************************************************************************************
 * 설정 Query Class
 * ******************************************************************************************************************/

import { MySqlQuery } from '@db_query_common';
import { Knex } from 'knex';
import { TConfig$Id } from '@db_models';

const tableName: Knex.TableNames = 'config';
type tableName = typeof tableName;

export default class Config extends MySqlQuery<tableName> {
  Id = TConfig$Id;

  constructor() {
    super(tableName);
  }

  /********************************************************************************************************************
   * 정보 (세션용)
   * ******************************************************************************************************************/
  async infoForSession(req: MyRequest, os: 'ios' | 'aos') {
    const info = await db.Config.getBuilder(req)
      .select(
        db.raw<{
          app_version: string;
          app_build_number: number;
          app_required_build_number: number;
        }>(
          os === 'ios'
            ? `
              ios_app_version as app_version,
              ios_app_build_number as app_build_number,
              ios_app_required_build_number as app_required_build_number,
              ios_market_url as market_url
            `
            : `
              aos_app_version as app_version,
              aos_app_build_number as app_build_number,
              aos_app_required_build_number as app_required_build_number,
              aos_market_url as market_url
            `
        )
      )
      .where('id', db.Config.Id)
      .first();

    if (!info) throw api.newExceptionError();

    return { auth_cookie_name: jwt.cookieName, ...info };
  }
}

export { Config };
