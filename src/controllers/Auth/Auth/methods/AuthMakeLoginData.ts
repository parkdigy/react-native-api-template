/********************************************************************************************************************
 * 로그인 데이터 생성 함수
 * ******************************************************************************************************************/

import { Param_Enum_Required } from '@common_param';
import { TUser } from '@db_models';

/** 로그인 데이터 생성을 위한 회원 정보 구조 */
export interface MakeLoginDataUserInfo
  extends Pick<
    TUser,
    'id' | 'user_key' | 'uuid' | 'email' | 'nickname' | 'name' | 'reg_type' | 'is_push_notification'
  > {}

export const AuthMakeLoginData = async (req: MyRequest, user?: MakeLoginDataUserInfo) => {
  const { _os_ } = param(req, { _os_: Param_Enum_Required(['ios', 'aos']) });

  // 설정 정보 조회
  const configInfo = await db.Config.infoForSession(req, _os_);

  return {
    auth: user
      ? {
          reg_type: user.reg_type,
          user_key: user.user_key,
          uuid: user.uuid,
          name: user.name,
          nickname: user.nickname,
          is_push_notification: user.is_push_notification,
        }
      : undefined,
    config: configInfo,
  };
};

export default AuthMakeLoginData;
