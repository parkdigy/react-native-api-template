/********************************************************************************************************************
 * 공지사항 컨트롤러
 * ******************************************************************************************************************/

import { Param_Id_Integer_Required, Param_Integer, Param_Limit, Param_String } from '@common_param';

export default {
  /********************************************************************************************************************
   * 목록
   * ******************************************************************************************************************/
  async list(req: MyRequest, res: MyResponse) {
    const { last_id, data_key, limit } = param(req, {
      last_id: Param_Integer(),
      data_key: Param_String(),
      ...Param_Limit(),
    });

    const dataKey = await db.DataKey.getDataKey(req, db.DataKey.Id.Notice);

    if (data_key === dataKey) {
      api.success(res, { data_key: dataKey });
    } else {
      const { data } = await db.Notice.list(req, last_id).paginate(1, limit);

      api.success(res, { data_key: dataKey, items: data });
    }
  },

  /********************************************************************************************************************
   * 정보
   * ******************************************************************************************************************/
  async info(req: MyRequest, res: MyResponse) {
    const { id } = param(req, Param_Id_Integer_Required());

    const info = await db.Notice.info(req, id);
    if (!info) throw paramError();

    api.success(res, info);
  },
};
