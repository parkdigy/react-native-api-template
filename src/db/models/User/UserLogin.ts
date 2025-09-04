/********************************************************************************************************************
 * 회원 로그인 정보 테이블
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { TableInsertData, TableUpdateData } from '@db_models_types';
import { makeEnum } from '@db_models_util';
import { TUser } from './User';
import { TDevice } from '../Device';

/** 가입 OS */
const Os = { ios: 'iOS', aos: 'Android' };
export type TUserLogin$Os = keyof typeof Os;
export const TUserLogin$Os = makeEnum('reg_os', Os);

export interface TUserLogin {
  /** Primary Key */
  user_id: TUser['id']; // 회원 ID
  app_key: string; // 앱 KEY // max:32
  /** Others */
  login_key: string; // 로그인 KEY // max:200
  os: TUserLogin$Os; // 가입 OS
  os_version: string; // OS 버전 // max:20
  build_number: string; // 빌드 번호 // max:10
  device_id: TDevice['id']; // 디바이스 ID
  expire_date: Date | null; // 만료일자
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TUserLogin$InsertData = TableInsertData<TUserLogin>;
export type TUserLogin$UpdateData = TableUpdateData<TUserLogin, 'user_id' | 'app_key' | 'create_date', 'update_date'>;

export default TUserLogin;

declare module 'knex/types/tables' {
  interface Tables {
    user_login: Knex.CompositeTableType<TUserLogin, TUserLogin$InsertData, TUserLogin$UpdateData>;
  }
}
