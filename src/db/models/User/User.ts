/********************************************************************************************************************
 * 회원 테이블
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { TableInsertData, TableUpdateData } from '@db_models_types';
import { makeEnum } from '@db_models_util';

/** 상태 */
const Status = { ON: '사용', RESIGN: '탈퇴' };
export type TUser$Status = keyof typeof Status;
export const TUser$Status = makeEnum('status', Status);

/** 가입 OS */
const RegOs = { ios: 'iOS', aos: 'Android' };
export type TUser$RegOs = keyof typeof RegOs;
export const TUser$RegOs = makeEnum('reg_os', RegOs);

/** 가입 구분 */
const RegType = { KAKAO: '카카오', NAVER: '네이버', GOOGLE: '구글', APPLE: '애플' };
export type TUser$RegType = keyof typeof RegType;
export const TUser$RegType = makeEnum('reg_type', RegType);

export interface TUser {
  /** Primary Key */
  id: number; // ID // AI, int
  /** Others */
  user_key: string; // 회원 KEY (UUID(하이픈제거) 형식) // UQ, max:200
  sns_user_id: string; // SNS 회원 ID // max:200
  nickname: string; // 이름 // max:20
  email: string | null; // 이메일 // max:100
  is_push_notification: boolean; // 푸시알림 받기 여부 // default:1
  login_date: Date | null; // 로그인 일자
  reg_os: TUser$RegOs; // 가입 OS
  reg_type: TUser$RegType; // 가입 구분
  resign_date: Date | null; // 탈퇴 일자
  status: TUser$Status; // 상태
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TUser$InsertData = TableInsertData<TUser, 'id', 'email' | 'is_push_notification' | 'resign_date'>;
export type TUser$UpdateData = TableUpdateData<TUser, 'id' | 'create_date', 'update_date'>;

export default TUser;

declare module 'knex/types/tables' {
  interface Tables {
    user: Knex.CompositeTableType<TUser, TUser$InsertData, TUser$UpdateData>;
  }
}
