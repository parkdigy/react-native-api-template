import express from 'express';
import { JwtCookieAuthChecker, Logger } from '@middlewares';
import Ping from './Ping';
import Deploy from './Deploy';
import Auth from './Auth';
import Common from './Common';
import Notice from './Notice';
import Faq from './Faq';
import My from './My';

const router = express.Router();

router.use('/deploy', Logger(), Deploy);
router.use('/ping', Ping);
router.use('/auth', Auth);
router.use('/common', Common);
router.use('/notice', Notice);
router.use('/faq', Faq);
router.use('/my', JwtCookieAuthChecker, My);

export default router;
