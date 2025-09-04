/********************************************************************************************************************
 * FAQ 컨트롤러
 * ******************************************************************************************************************/

import { Param_String } from '@common_param';

export default {
  /********************************************************************************************************************
   * 목록
   * ******************************************************************************************************************/
  async list(req: MyRequest, res: MyResponse) {
    const { data_key } = param(req, { data_key: Param_String() });

    const dataKey = await db.DataKey.getDataKey(req, db.DataKey.Id.Faq);

    if (data_key === dataKey) {
      api.success(res, { data_key: dataKey });
    } else {
      const data = await db.Faq.list(req);

      api.success(res, { data_key: dataKey, items: data });
    }
  },
};
