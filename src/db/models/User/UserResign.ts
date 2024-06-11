/********************************************************************************************************************
 * 회원 탈퇴 테이블
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { TableInsertData, TableUpdateData } from '@db_models_types';
import TUser from './User';

export interface TUserResign {
  /** Primary Key */
  user_id: TUser['id']; // 회원 ID
  /** Others */
  reason: string; // 탈퇴사유 // text
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TUserResign$InsertData = TableInsertData<TUserResign>;
export type TUserResign$UpdateData = TableUpdateData<TUserResign, 'user_id' | 'reason' | 'create_date', 'update_date'>;

export default TUserResign;

declare module 'knex/types/tables' {
  interface Tables {
    user_resign: Knex.CompositeTableType<TUserResign, TUserResign$InsertData, TUserResign$UpdateData>;
  }
}
