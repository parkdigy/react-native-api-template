/********************************************************************************************************************
 * FAQ 카테고리 테이블
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { TableInsertData, TableUpdateData } from '@db_models_types';
import { makeEnum } from '@db_models_util';

/** 상태 */
const Status = { ON: '노출', OFF: '숨김' };
export type TFaqCategory$Status = keyof typeof Status;
export const TFaqCategory$Status = makeEnum('status', Status);

export interface TFaqCategory {
  /** Primary Key */
  id: number; // AI, int
  /** Others */
  name: string; // 카테고리명 // max:20
  status: TFaqCategory$Status; // 상태
  view_seq: number; // 노출순서 // int
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TFaqCategory$InsertData = TableInsertData<TFaqCategory, 'id'>;
export type TFaqCategory$UpdateData = TableUpdateData<TFaqCategory, 'id' | 'create_date', 'update_date'>;

export default TFaqCategory;

declare module 'knex/types/tables' {
  interface Tables {
    faq_category: Knex.CompositeTableType<TFaqCategory, TFaqCategory$InsertData, TFaqCategory$UpdateData>;
  }
}
