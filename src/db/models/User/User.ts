/********************************************************************************************************************
 * 회원 테이블
 * ******************************************************************************************************************/

import { Knex } from 'knex';
import { type TableInsertData, type TableUpdateData } from '../@types';
import type { UserRegOs, UserRegType, UserStatus } from '@const';

export interface TUser {
  /** Primary Key */
  id: number; // ID // AI, int
  /** Others */
  user_key: string; // 회원 KEY (UUID(하이픈제거) 형식) // UQ, max:200
  uuid: string; // UUID // UQ, max:36
  sns_user_id: string; // SNS 회원 ID // max:200
  name: string | null; // 이름 // max:100
  nickname: string; // 이름 // max:20
  email: string | null; // 이메일 // max:100
  is_push_notification: boolean; // 푸시알림 받기 여부 // default:1
  reg_os: UserRegOs; // 가입 OS
  reg_type: UserRegType; // 가입 구분
  reg_app_key: string; // 가입 APP KEY // max:32
  reg_install_app_key: string; // 가입 설치 APP KEY // max:32
  login_date: Date | null; // 로그인 일자
  resign_date: Date | null; // 탈퇴 일자
  status: UserStatus; // 상태
  create_date: Date; // 등록일자
  update_date: Date; // 수정일자
}

export type TUser$InsertData = TableInsertData<TUser, 'id', 'email' | 'name' | 'is_push_notification' | 'resign_date'>;
export type TUser$UpdateData = TableUpdateData<TUser, 'id' | 'uuid' | 'create_date', 'update_date'>;

export type { TUser as default };

declare module 'knex/types/tables' {
  interface Tables {
    user: Knex.CompositeTableType<TUser, TUser$InsertData, TUser$UpdateData>;
  }
}
