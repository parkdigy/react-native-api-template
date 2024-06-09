/********************************************************************************************************************
 * 회원 테이블
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { TableInsertData, TableUpdateData } from '@db_models_types';
import { makeEnum } from '@db_models_util';
import { TUser } from '@db_models';

/** 가입 OS */
const Os = { ios: 'iOS', aos: 'Android' };
export type TUserLogin$Os = keyof typeof Os;
export const TUserLogin$Os = makeEnum('reg_os', Os);

export interface TUserLogin {
  /** Primary Key */
  login_key: string; // 로그인 KEY // max:200
  /** Others */
  user_id: TUser['id']; // 회원 ID
  os: TUserLogin$Os; // 가입 OS
  sns_access_token: string | null; // SNS Access Token // max:200
  sns_access_token_exp: Date | null; // SNS Access Token 만료일자
  sns_refresh_token: string | null; // SNS Refresh Token // max:200
  sns_refresh_token_exp: Date | null; // SNS Refresh Token 만료일자
  expire_date: Date | null; // 만료일자
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TUserLogin$InsertData = TableInsertData<
  TUserLogin,
  never,
  'sns_access_token' | 'sns_access_token_exp' | 'sns_refresh_token' | 'sns_refresh_token_exp'
>;
export type TUserLogin$UpdateData = TableUpdateData<
  TUserLogin,
  'login_key' | 'user_id' | 'os' | 'create_date',
  'update_date'
>;

export default TUserLogin;

declare module 'knex/types/tables' {
  interface Tables {
    user_login: Knex.CompositeTableType<TUserLogin, TUserLogin$InsertData, TUserLogin$UpdateData>;
  }
}
