/********************************************************************************************************************
 * 내 정보 수정 컨트롤러
 * ******************************************************************************************************************/

import { Param_Boolean_Required, Param_String_Required } from '@common_param';

export default {
  /********************************************************************************************************************
   * 닉네임 수정
   * ******************************************************************************************************************/
  async editNickname(req: MyRequest, res: MyResponse) {
    if (!req.$$user) throw api.Error.Permission;

    const { nickname } = param(req, { nickname: Param_String_Required() });

    if (nickname != req.$$user.nickname) {
      await db.User.edit(req, { nickname, update_date: now() }, { id: req.$$user.id });
    }

    api.success(res);
  },

  /********************************************************************************************************************
   * 푸시알림 수정
   * ******************************************************************************************************************/
  async editIsPushNotification(req: MyRequest, res: MyResponse) {
    if (!req.$$user) throw api.Error.Permission;

    const { is_push_notification } = param(req, { is_push_notification: Param_Boolean_Required() });

    if (is_push_notification != req.$$user.is_push_notification) {
      await db.User.edit(req, { is_push_notification, update_date: now() }, { id: req.$$user.id });
    }

    api.success(res);
  },
};
