/********************************************************************************************************************
 * 로그인 데이터 생성 함수
 * ******************************************************************************************************************/

import { Param_Enum_Required } from '@common_param';
import { TUser$RegType } from '@db_models';

/** 로그인 데이터 생성을 위한 회원 정보 구조 */
export interface MakeLoginDataUserInfo {
  reg_type: TUser$RegType; // 가입 구분
  user_key: string; // 회원 KEY
  nickname: string; // 이름
  is_push_notification: boolean; // 이벤트 푸시 수신 여부
}

export const AuthMakeLoginData = async (req: MyRequest, user?: MakeLoginDataUserInfo) => {
  const { _os_ } = param(req, { _os_: Param_Enum_Required(['ios', 'aos']) });

  // 설정 정보 조회
  const configInfo = await db.Config.infoForSession(req, _os_);

  return {
    auth: user
      ? {
          reg_type: user.reg_type,
          user_key: user.user_key,
          nickname: user.nickname,
          is_push_notification: user.is_push_notification,
        }
      : undefined,
    config: configInfo,
  };
};

export default AuthMakeLoginData;
