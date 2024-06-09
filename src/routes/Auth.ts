/********************************************************************************************************************
 * 인증 라우터
 * ******************************************************************************************************************/

import express from 'express';
import { Auth } from '@controllers';
import { ApiController, JwtCookieAuthChecker } from '@middlewares';
import JwtNoErrorCookieAuthChecker from '../middlewares/JwtNoErrorCookieAuthChecker';

const router = express.Router();

/********************************************************************************************************************
 * 로그인/로그아웃
 * ******************************************************************************************************************/
// 로그인 정보
router.get('/signin', JwtNoErrorCookieAuthChecker, ApiController(Auth.getInfo));
// 로그인
router.post('/signin', ApiController(Auth.signIn));
// 로그아웃
router.post('/signout', JwtCookieAuthChecker, ApiController(Auth.signOut));

export default router;
