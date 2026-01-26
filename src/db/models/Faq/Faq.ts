/********************************************************************************************************************
 * FAQ 테이블
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { type TableInsertData, type TableUpdateData } from '@db_models_types';
import { type TFaqCategory } from './FaqCategory';
import type { FaqStatus } from '@const';

export interface TFaq {
  /** Primary Key */
  id: number; // AI, int
  /** Others */
  faq_category_id: TFaqCategory['id']; // 카테고리 ID // int
  title: string; // 제목 // max:100
  content: string; // 내용 // text
  status: FaqStatus; // 상태
  view_seq: number; // 노출순서 // int
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TFaq$InsertData = TableInsertData<TFaq, 'id'>;
export type TFaq$UpdateData = TableUpdateData<TFaq, 'id' | 'create_date', 'update_date'>;

export type { TFaq as default };

declare module 'knex/types/tables' {
  interface Tables {
    faq: Knex.CompositeTableType<TFaq, TFaq$InsertData, TFaq$UpdateData>;
  }
}
