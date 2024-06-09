/********************************************************************************************************************
 * 공통 라우터
 * ******************************************************************************************************************/

import express from 'express';
import { Common } from '@controllers';
import { ApiController } from '@middlewares';

const router = express.Router();

// 설정 정보
router.get('/config', ApiController(Common.configInfo));
// FCM 토큰 삭제
router.delete('/fcm', ApiController(Common.removeFcm));

export default router;
