/********************************************************************************************************************
 * MY 라우터
 * ******************************************************************************************************************/

import express from 'express';
import { My, MyEdit } from '@controllers';
import { ApiController } from '@middlewares';

const router = express.Router();

// 탈퇴
router.post('/resign', ApiController(My.resign));
// FCM 토큰 등록
router.post('/fcm', ApiController(My.addFcm));

// 내 정보
router.get('/', ApiController(My.info));
// 닉네임 수정
router.patch('/nickname', ApiController(MyEdit.editNickname));
// 푸시 알림 수정
router.patch('/is_push_notification', ApiController(MyEdit.editIsPushNotification));

export default router;
