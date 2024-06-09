/********************************************************************************************************************
 * FAQ 라우터
 * ******************************************************************************************************************/

import express from 'express';
import { Faq } from '@controllers';
import { ApiController } from '@middlewares';

const router = express.Router();

// FAQ - 목록
router.get('/', ApiController(Faq.list));

export default router;
