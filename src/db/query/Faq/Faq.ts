/********************************************************************************************************************
 * FAQ Query Class
 * ******************************************************************************************************************/

import { MySqlQuery } from '@db_query_common';
import { Knex } from 'knex';
import { TFaq$Status } from '@db_models';

const tableName: Knex.TableNames = 'faq';
type tableName = typeof tableName;

export default class Faq extends MySqlQuery<tableName> {
  Status = TFaq$Status;

  constructor() {
    super(tableName);
  }

  /********************************************************************************************************************
   * 목록
   * ******************************************************************************************************************/
  list(req: MyRequest) {
    return (
      db.Faq.getBuilder(req, 'f')
        .select('f.id', 'f.title', 'f.content')
        // faq_category
        .join(db.FaqCategory.getTableName('fc'), 'fc.id', 'f.faq_category_id')
        .select('fc.name as category')
        //
        .where('f.status', db.Faq.Status.On)
        .where('fc.status', db.FaqCategory.Status.On)
        .orderBy('fc.view_seq')
        .orderBy('f.view_seq')
    );
  }
}

export { Faq };
