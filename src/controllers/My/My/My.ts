/********************************************************************************************************************
 * MY 컨트롤러
 * ******************************************************************************************************************/

import { Param_Array_Required, Param_Enum_Required, Param_String_Required } from '@common_param';
import { Auth } from '../../Auth';

export default {
  /********************************************************************************************************************
   * 내 정보
   * ******************************************************************************************************************/
  async info(req: MyRequest, res: MyResponse) {
    if (!req.$$user) throw api.Error.Permission;

    const loginData = await Auth.makeLoginData(req, req.$$user);

    api.success(res, loginData);
  },

  /********************************************************************************************************************
   * FCM 토큰 등록
   * ******************************************************************************************************************/
  async addFcm(req: MyRequest, res: MyResponse) {
    if (!req.$$user) throw api.Error.Permission;

    const {
      token,
      _os_: os,
      _os_v_: osVersion,
      _bn_: buildNumber,
      _dm_: deviceModel,
      _dmf_: deviceManufacturer,
    } = param(req, {
      token: Param_String_Required(),
      _os_: Param_Enum_Required(['ios', 'aos']),
      _os_v_: Param_String_Required(),
      _bn_: Param_String_Required(),
      _dm_: Param_String_Required(),
      _dmf_: Param_String_Required(),
    });

    await util.fcm.addToken(req, token, {
      userId: req.$$user.id,
      os: os === 'ios' ? db.FcmToken.Os.Ios : db.FcmToken.Os.Android,
      osVersion,
      buildNumber,
      deviceModel,
      deviceManufacturer,
      isPushNotification: req.$$user.is_push_notification,
    });

    api.success(res);
  },

  /********************************************************************************************************************
   * 회원 탈퇴
   * ******************************************************************************************************************/
  async resign(req: MyRequest, res: MyResponse) {
    if (!req.$$user) throw api.Error.Permission;

    const { reasons } = param(req, {
      reasons: Param_Array_Required('string'),
    });

    const userId = req.$$user.id;

    const info = await db.User.find(req, { id: userId }).select('status');
    if (!info) throw api.newExceptionError();
    if (info.status === db.User.Status.Resign) throw api.Error.my.resign.alreadyResign;

    const nowDate = now();
    const resignValue = `⨴${userId}⨵`;

    await db.trans.begin(req);

    // 회원탈퇴 테이블에 등록
    await db.UserResign.add(req, {
      user_id: userId,
      reason: reasons.join('\n'),
      create_date: nowDate,
      update_date: nowDate,
    });

    // 회원정보 탈퇴 정보로 업데이트
    await db.User.edit(
      req,
      {
        user_key: resignValue,
        sns_user_id: resignValue,
        nickname: resignValue,
        email: resignValue,
        status: db.User.Status.Resign,
        resign_date: nowDate,
        update_date: nowDate,
      },
      { id: userId }
    );

    // FCM 토큰 구독 해제 및 삭제
    const fcmTokenList = await db.FcmToken.getBuilder(req).select('id', 'os').where('user_id', userId);

    for (const fcmTokenInfo of fcmTokenList) {
      await util.fcm.unsubscribeTokensFromAllTopic(fcmTokenInfo.os, [fcmTokenInfo.id]);
    }
    await db.FcmToken.remove(req, { user_id: userId });

    // SNS 로그인 정보 삭제
    await db.UserLogin.remove(req, { user_id: userId });

    await db.trans.commit(req);

    api.success(res);
  },
};
