import { NextFunction } from 'express';

/**
 * session 로그인 여부 검사
 * @return IRouterHandler
 */
export default async function (req: MyRequest, res: MyResponse, next: NextFunction) {
  try {
    const { userKey, loginType, loginKey } = jwt.verifyAccessToken(req);
    if (userKey && loginType && loginKey) {
      if (await db.UserLogin.validate(req, loginKey)) {
        const user = await db.User.info(req, userKey);
        if (user && user.reg_type === loginType && user.status !== db.User.Status.Resign) {
          req.$$user = { ...user, login_key: loginKey };
        } else {
          jwt.clearAccessToken(res);
        }
      } else {
        jwt.clearAccessToken(res);
      }
    }
  } catch {
    //
  }

  next();
}
