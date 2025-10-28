/********************************************************************************************************************
 * 기본 API Controller 미들웨어
 * - 로깅 기록 (선택)
 * - Starter 실행
 * - 오류가 없으면, Transaction Commit 실행
 * - 오류가 있으면, Transaction Rollback 실행
 * - Finisher 실행
 * ******************************************************************************************************************/

import Starter from './Starter';
import Finisher from './Finisher';
import Logger from './Logger';
import { MyAuthController, MyController } from '@types';
import { NextFunction, RequestHandler } from 'express';
import CommonLogging from '@common_logging';
import { ApiError } from '@common_api';

export default function (
  controller: MyController | MyAuthController,
  logging = true,
  loggingData = false,
  afterStartMiddlewares: RequestHandler[] = [],
  beforeFinishMiddlewares: RequestHandler[] = []
) {
  const handlers = [];

  if (logging) {
    handlers.push(Logger(loggingData));
  }

  handlers.push(
    Starter,
    ...afterStartMiddlewares,
    async (req: MyRequest | MyAuthRequest, res: MyResponse, next: NextFunction) => {
      const handleException = async (err: Error) => {
        printError(req, err);

        try {
          await db.trans.rollbackAll(req);
        } catch (err) {
          printError(req, err as Error);
        }

        api.error(res, err);
      };

      try {
        await controller(req as any, res);
        try {
          await db.trans.commitAll(req);
        } catch (err) {
          await handleException(err as Error);
        }
      } catch (err) {
        const isApiError = err instanceof ApiError;
        if (!isApiError || (isApiError && err.getCode() >= 99998)) {
          CommonLogging.err(
            `${req.$$remoteIpAddress} ${req.method} ${util.url.join(req.baseUrl, req.url)}`,
            (err as Error).toString()
          );
        }

        await handleException(err as Error);
      }

      next();
    },
    ...beforeFinishMiddlewares,
    Finisher
  );

  return handlers;
}
