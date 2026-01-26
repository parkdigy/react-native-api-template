import { UserRegType } from './User';

/********************************************************************************************************************
 * 회원 로그인 SNS 구분
 * ******************************************************************************************************************/

export const UserLoginSnsType = UserRegType;
export type UserLoginSnsType = typeof UserLoginSnsType.Type;
