/********************************************************************************************************************
 * FAQ 카테고리 Query Class
 * ******************************************************************************************************************/

import { MySqlQuery } from '@db_query_common';
import { Knex } from 'knex';
import { TFaqCategory$Status } from '@db_models';

const tableName: Knex.TableNames = 'faq_category';
type tableName = typeof tableName;

export default class FaqCategory extends MySqlQuery<tableName> {
  Status = TFaqCategory$Status;

  constructor() {
    super(tableName);
  }
}

export { FaqCategory };
