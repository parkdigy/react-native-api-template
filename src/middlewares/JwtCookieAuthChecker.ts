/********************************************************************************************************************
 * 세션 로그인 여부 검사 미들웨어
 * - JWT 토큰을 쿠키에서 검사하여 로그인 여부 확인
 * - 로그인 여부에 따라 req.$$user 에 사용자 정보 저장
 * - 로그인 여부에 따라 새로운 JWT 토큰을 재발급
 * - 로그인 실패 시, 쿠키에서 JWT 토큰을 삭제
 * ******************************************************************************************************************/

import { NextFunction } from 'express';
import CommonLogging from '@common_logging';
import { ApiError } from '@common_api';

export default async function (req: MyRequest, res: MyResponse, next: NextFunction) {
  const handleUnauthorized = () => {
    api.error(res, api.Error.Unauthorized);
  };

  try {
    const { userKey, loginType, loginKey } = jwt.verifyAccessToken(req);
    if (userKey && loginType && loginKey) {
      if (await db.UserLogin.validate(req, loginKey)) {
        const user = await db.User.info(req, userKey);
        if (user && user.reg_type === loginType && user.status !== db.User.Status.Resign) {
          req.$$user = { ...user, login_key: loginKey };
          next();
        } else {
          jwt.clearAccessToken(res);
          handleUnauthorized();
        }
      } else {
        jwt.clearAccessToken(res);
        handleUnauthorized();
      }
    } else {
      handleUnauthorized();
    }
  } catch (err) {
    const isApiError = err instanceof ApiError;
    if (!isApiError || (isApiError && err.getCode() >= 90000)) {
      CommonLogging.err(
        `${req.$$remoteIpAddress} ${req.method} ${util.url.join(req.baseUrl, req.url)}`,
        (err as Error).toString()
      );
    }

    handleUnauthorized();
  }
}
