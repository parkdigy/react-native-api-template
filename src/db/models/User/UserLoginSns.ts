/********************************************************************************************************************
 * 회원 로그인 SNS 정보 테이블
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { TableInsertData, TableUpdateData } from '@db_models_types';
import { TUser$RegType } from './User';

export type TUserLoginSns$Type = Exclude<TUser$RegType, 'GUEST'>;
export const TUserLoginSns$Type = TUser$RegType;

export interface TUserLoginSns {
  /** Primary Key */
  type: TUserLoginSns$Type; // 가입 구분
  sns_user_id: string; // SNS 회원 ID // max:200
  /** Others */
  sns_access_token: string | null; // SNS Access Token // max:200
  sns_access_token_exp: Date | null; // SNS Access Token 만료일자
  sns_refresh_token: string | null; // SNS Refresh Token // max:200
  sns_refresh_token_exp: Date | null; // SNS Refresh Token 만료일자
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TUserLoginSns$InsertData = TableInsertData<
  TUserLoginSns,
  never,
  'sns_access_token' | 'sns_access_token_exp' | 'sns_refresh_token' | 'sns_refresh_token_exp'
>;
export type TUserLoginSns$UpdateData = TableUpdateData<
  TUserLoginSns,
  'type' | 'sns_user_id' | 'create_date',
  'update_date'
>;

export default TUserLoginSns;

declare module 'knex/types/tables' {
  interface Tables {
    user_login_sns: Knex.CompositeTableType<TUserLoginSns, TUserLoginSns$InsertData, TUserLoginSns$UpdateData>;
  }
}
