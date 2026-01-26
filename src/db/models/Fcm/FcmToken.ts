/********************************************************************************************************************
 * FCM 토큰 테이블
 * - 회원의 FCM 토큰을 등록
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { type TableInsertData, type TableUpdateData } from '@db_models_types';
import { type TUser } from '../User';
import type { FcmTokenOs } from '@const';

export interface TFcmToken {
  /** Primary Key */
  id: string; // FCM 토큰 // max:200
  /** Others */
  user_id: TUser['id']; // 회원 ID
  os: FcmTokenOs; // OS
  os_version: string; // OS 버전 // max:20
  build_number: string; // 앱 빌드번호 // max:20
  device_model: string; // 기기 모델명 // max:50
  device_manufacturer: string; // 기기 제조사명 // max:50
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TFcmToken$InsertData = TableInsertData<TFcmToken>;
export type TFcmToken$UpdateData = TableUpdateData<
  TFcmToken,
  'id' | 'os' | 'device_model' | 'device_manufacturer' | 'create_date',
  'update_date'
>;

export type { TFcmToken as default };

declare module 'knex/types/tables' {
  interface Tables {
    fcm_token: Knex.CompositeTableType<TFcmToken, TFcmToken$InsertData, TFcmToken$UpdateData>;
  }
}
