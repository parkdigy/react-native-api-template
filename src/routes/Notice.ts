/********************************************************************************************************************
 * 공지사항 라우터
 * ******************************************************************************************************************/

import express from 'express';
import { Notice } from '@controllers';
import { ApiController } from '@middlewares';

const router = express.Router();

// 공지사항 - 목록
router.get('/', ApiController(Notice.list));
// 공지사항 - 조회
router.get('/:id', ApiController(Notice.info));

export default router;
