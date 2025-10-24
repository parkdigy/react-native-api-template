/********************************************************************************************************************
 * JWT 모듈
 * ******************************************************************************************************************/

import _jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { JwtPayload } from './jwt.types';
import crypt from '../crypt';
import { CookieOptions } from 'express';

const jwt = {
  cookieName: ifEmpty(process.env.AUTH_JWT_TOKEN_COOKIE_NAME, `_${process.env.PROJECT_NAME}_ajt_`), // AccessToken 저장 쿠키명
  useUserAgent: false, // 토큰 검증 시 User-Agent 사용 여부 (true 시 User-Agent 가 변경되면 인증 실패)
  useIpAddress: false, // 토큰 검증 시 IP 주소 사용 여부 (true 시 IP 주소가 변경되면 인증 실패)

  /********************************************************************************************************************
   * JWT 토큰 생성
   * ******************************************************************************************************************/
  sign(payload: string | Buffer | object, options?: SignOptions) {
    return _jwt.sign(payload, process.env.APP_KEY, options);
  },

  /********************************************************************************************************************
   * JWT 토큰 검증
   * ******************************************************************************************************************/
  verify(token: string, options?: VerifyOptions) {
    return _jwt.verify(token, process.env.APP_KEY, options) as JwtPayload;
  },
  /********************************************************************************************************************
   * JWT 토큰 저장
   * ******************************************************************************************************************/
  saveAccessToken(
    req: MyRequest,
    res: MyResponse,
    userKey: string,
    loginType: string,
    loginKey: string,
    expireDays = Number(ifEmpty(process.env.AUTH_JWT_TOKEN_EXPIRES_DAYS, '-1'))
  ) {
    const jwtOptions: SignOptions = {};
    if (expireDays > -1) {
      jwtOptions.expiresIn = `${expireDays}d`;
    }
    const payloadData = {
      dt: dayjs().format('YYYYMMDDHHmmss'),
      ua: this.useUserAgent ? req.get('User-Agent') : null,
      ip: this.useIpAddress ? req.$$remoteIpAddress : null,
      key: userKey,
      ltype: loginType,
      lkey: loginKey,
      ed: expireDays,
    };
    const payload: JwtPayload = { key: crypt.enc(JSON.stringify(payloadData)) };

    const accessToken = this.sign(payload, jwtOptions);

    const options: CookieOptions = { httpOnly: true };
    if (expireDays > -1) {
      options.maxAge = 1000 * 60 * 60 * 24 * expireDays;
    }

    res.clearCookie(this.cookieName);
    res.cookie(this.cookieName, accessToken, options);
  },

  /********************************************************************************************************************
   * JWT 토큰 검증
   * ******************************************************************************************************************/
  verifyAccessToken(req: MyRequest) {
    let userKey: string | undefined = undefined;
    let loginType: string | undefined = undefined;
    let loginKey: string | undefined = undefined;
    let expireDays: number | undefined = undefined;
    try {
      const token = req.cookies[this.cookieName];
      if (token) {
        const { key } = jwt.verify(token);
        const payload = crypt.dec(key);
        const payloadData = JSON.parse(payload) as {
          dt: string;
          ua: string | null;
          ip: string | null;
          key: string;
          ltype: string;
          lkey: string;
          ed: number;
        };

        userKey = payloadData.key;
        loginType = payloadData.ltype;
        loginKey = payloadData.lkey;
        expireDays = payloadData.ed;

        if (userKey && this.useUserAgent) {
          if (payloadData.ua !== req.get('User-Agent')) {
            userKey = undefined;
            expireDays = undefined;
          }
        }
        if (userKey && this.useIpAddress) {
          if (payloadData.ip !== req.$$remoteIpAddress) {
            userKey = undefined;
            expireDays = undefined;
          }
        }
      }
    } catch (err) {
      ll(err);
    }
    return { userKey, loginType, loginKey, expireDays };
  },

  /********************************************************************************************************************
   * JWT 토큰 삭제
   * ******************************************************************************************************************/
  clearAccessToken(res: MyResponse) {
    res.clearCookie(this.cookieName);
  },
};

export default jwt;
