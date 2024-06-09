/********************************************************************************************************************
 * 기본 Controller 미들웨어
 * - 세션 인증 검사 실행 (선택)
 * - Starter 실행
 * - 오류가 없으면, Transaction Commit 실행
 * - 오류가 있으면, Transaction Rollback 실행
 * - Finisher 실행
 * ******************************************************************************************************************/

import Starter from './Starter';
import Finisher from './Finisher';
import SessionAuthChecker from './JwtCookieAuthChecker';
import { MyController } from '@types';
import { NextFunction, RequestHandler } from 'express';
import CommonLogging from '@common_logging';
import { ApiError } from '@common_api';

export default function (
  controller: MyController,
  sessionAuthCheck = false,
  afterStartMiddlewares: RequestHandler[] = [],
  beforeFinishMiddlewares: RequestHandler[] = []
) {
  const result = [
    Starter,
    ...afterStartMiddlewares,
    async (req: MyRequest, res: MyResponse, next: NextFunction) => {
      try {
        await controller(req, res);
        await db.trans.commitAll(req);
      } catch (err) {
        await db.trans.rollbackAll(req);

        const isApiError = err instanceof ApiError;
        if (!isApiError || (isApiError && err.getCode() >= 90000)) {
          CommonLogging.err(
            `${req.$$remoteIpAddress} ${req.method} ${util.url.join(req.baseUrl, req.url)}`,
            (err as Error).toString()
          );
        }

        res.send((err as Error).toString());
      }

      next();
    },
    ...beforeFinishMiddlewares,
    Finisher,
  ];

  if (sessionAuthCheck) {
    result.unshift(SessionAuthChecker);
  }

  return result;
}
