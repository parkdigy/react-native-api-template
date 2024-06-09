import { SignOptions, JwtPayload as _JwtPayload, VerifyOptions } from 'jsonwebtoken';

export interface JwtPayload extends _JwtPayload {
  key: string;
}

export interface Jwt {
  cookieName: string;
  useUserAgent: boolean;
  useIpAddress: boolean;
  sign(payload: string | Buffer | object, options?: SignOptions): string;
  verify(token: string, options?: VerifyOptions): JwtPayload;
  saveAccessToken(
    req: MyRequest,
    res: MyResponse,
    userKey: string,
    loginType: string,
    loginKey: string,
    expireDays?: number
  ): void;
  verifyAccessToken(req: MyRequest): {
    userKey: string | undefined;
    loginType: string | undefined;
    loginKey: string | undefined;
    expireDays: number | undefined;
  };
  clearAccessToken(res: MyResponse): void;
}
