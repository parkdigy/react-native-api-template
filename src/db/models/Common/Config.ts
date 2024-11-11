/********************************************************************************************************************
 * 설정 테이블
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { TableUpdateData } from '@db_models_types';

export const TConfig$Id = 1;

export interface TConfig {
  /** Primary Key */
  id: number; // ID // PK, int
  /** Others */
  ios_app_version: string; // iOS 앱 버전 // max:10
  ios_app_build_number: number; // iOS 앱 빌드번호 // int
  ios_app_required_build_number: number; // iOS 앱 강제 업데이트 빌드번호 // int
  ios_market_url: string; // iOS 마켓 URL // max:100
  aos_app_version: string; // Android 앱 버전 // max:10
  aos_app_build_number: number; // Android 앱 빌드번호 // int
  aos_app_required_build_number: number; // Android 앱 강제 업데이트 빌드번호 // int
  aos_market_url: string; // Android 마켓 URL // max:100
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TConfig$UpdateData = TableUpdateData<TConfig, 'id', 'update_date'>;

export default TConfig;

declare module 'knex/types/tables' {
  interface Tables {
    config: Knex.CompositeTableType<TConfig, never, TConfig$UpdateData>;
  }
}
