/********************************************************************************************************************
 * 공지사항 테이블
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { TableInsertData, TableUpdateData } from '@db_models_types';
import { makeEnum } from '@db_models_util';

/** 상태 */
const Status = { ON: '노출', OFF: '숨김' };
export type TNotice$Status = keyof typeof Status;
export const TNotice$Status = makeEnum('status', Status);

export interface TNotice {
  /** Primary Key */
  id: number; // AI, int
  /** Others */
  title: string; // 제목 // max:100
  content: string; // 내용 // text
  notice_date: Date; // 공지일자
  status: TNotice$Status; // 상태
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TNotice$InsertData = TableInsertData<TNotice, 'id'>;
export type TNotice$UpdateData = TableUpdateData<TNotice, 'id' | 'create_date', 'update_date'>;

export default TNotice;

declare module 'knex/types/tables' {
  interface Tables {
    notice: Knex.CompositeTableType<TNotice, TNotice$InsertData, TNotice$UpdateData>;
  }
}
