/********************************************************************************************************************
 * 공지사항 Query Class
 * ******************************************************************************************************************/

import { MySqlQuery } from '@db_query_common';
import { Knex } from 'knex';
import { TNotice$Status } from '@db_models';

const tableName: Knex.TableNames = 'notice';
type tableName = typeof tableName;

export default class Notice extends MySqlQuery<tableName> {
  Status = TNotice$Status;

  constructor() {
    super(tableName);
  }

  /********************************************************************************************************************
   * 목록
   * ******************************************************************************************************************/
  list(req: MyRequest, lastId?: number) {
    const builder = db.Notice.getBuilder(req)
      .select('id', 'title', 'notice_date')
      .where('status', db.Notice.Status.On)
      .orderBy('id', 'desc');

    if (lastId) {
      builder.where('id', '<', lastId);
    }

    return builder;
  }

  /********************************************************************************************************************
   * 정보
   * ******************************************************************************************************************/
  info(req: MyRequest, id: number) {
    return db.Notice.getBuilder(req).select('id', 'title', 'notice_date', 'content').where('id', id).first();
  }
}

export { Notice };
