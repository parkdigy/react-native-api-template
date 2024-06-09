/********************************************************************************************************************
 * 데이터 KEY 테이블
 * - ID 에 해당하는 데이터 변경 시 마다 '데이터 변경 KEY' 를 1 증가 시킨다.
 * - 앱에서 첫 페이지 데이터 요청 시 '데이터 변경 KEY' 를 함께 내려준다.
 * - 앱에서는 '데이터 변경 KEY' 와 함께 첫 페이지의 데이터를 내부에 저장한다.
 * - 다음 요청 시 '데이터 요청 KEY' 를 함께 받는다.
 * - '데이터 변경 KEY' 가 일치하면, DB 에서 Query 하지 않고, 데이터를 내려주지 않고, 앱에서는 내부에 저장된 데이터를 보여준다.
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { TableInsertData, TableUpdateData } from '@db_models_types';

/** ID */
export const TDataKey$Id = {
  Notice: 'notice',
  Faq: 'faq',
} as const;
export type TDataKey$Id = ValueOf<typeof TDataKey$Id>;

export interface TDataKey {
  /** Primary Key */
  id: string; // ID // max:20
  /** Others */
  data_key: number; // 데이터 변경 KEY (변경 시 마다 1 증가) : bigint
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TDataKey$InsertData = TableInsertData<TDataKey>;
export type TDataKey$UpdateData = TableUpdateData<TDataKey, 'id', 'update_date'>;

export default TDataKey;

declare module 'knex/types/tables' {
  interface Tables {
    data_key: Knex.CompositeTableType<TDataKey, TDataKey$InsertData, TDataKey$UpdateData>;
  }
}
