/********************************************************************************************************************
 * 공통 컨트롤러
 * ******************************************************************************************************************/

import { Param_Enum_Required, Param_String_Required } from '@common_param';

export default {
  /********************************************************************************************************************
   * 설정 정보
   * ******************************************************************************************************************/
  async configInfo(req: MyRequest, res: MyResponse) {
    const { _os_ } = param(req, { _os_: Param_Enum_Required(['ios', 'aos']) });

    const info = await db.Config.infoForSession(req, _os_);

    api.success(res, info);
  },

  /********************************************************************************************************************
   * FCM 토큰 삭제
   * ******************************************************************************************************************/
  async removeFcm(req: MyRequest, res: MyResponse) {
    const { token } = param(req, { token: Param_String_Required() });

    const info = await db.FcmToken.find(req, { id: token }).select('os');
    if (info) {
      await util.fcm.unsubscribeTokensFromAllTopic(info.os, [token]);
      await db.FcmToken.remove(req, { id: token });
    }

    api.success(res);
  },
};
