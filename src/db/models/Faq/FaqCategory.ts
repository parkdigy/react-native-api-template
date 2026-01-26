/********************************************************************************************************************
 * FAQ 카테고리 테이블
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { type TableInsertData, type TableUpdateData } from '@db_models_types';
import type { FaqCategoryStatus } from '@const';

export interface TFaqCategory {
  /** Primary Key */
  id: number; // AI, int
  /** Others */
  name: string; // 카테고리명 // max:20
  status: FaqCategoryStatus; // 상태
  view_seq: number; // 노출순서 // int
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TFaqCategory$InsertData = TableInsertData<TFaqCategory, 'id'>;
export type TFaqCategory$UpdateData = TableUpdateData<TFaqCategory, 'id' | 'create_date', 'update_date'>;

export type { TFaqCategory as default };

declare module 'knex/types/tables' {
  interface Tables {
    faq_category: Knex.CompositeTableType<TFaqCategory, TFaqCategory$InsertData, TFaqCategory$UpdateData>;
  }
}
