/********************************************************************************************************************
 * FAQ 카테고리 Query Class
 * ******************************************************************************************************************/

import { MySqlQuery } from '@db_query_common';
import { Knex } from 'knex';
import { FaqCategoryStatus } from '@const';

const tableName: Knex.TableNames = 'faq_category';
type tableName = typeof tableName;

export default class FaqCategory extends MySqlQuery<tableName> {
  Status = FaqCategoryStatus;

  constructor() {
    super(tableName);
  }
}

export { FaqCategory };
