/********************************************************************************************************************
 * 인증 컨트롤러
 * ******************************************************************************************************************/

import { Param_Boolean, Param_String } from '@common_param';
import { AuthSignIn, AuthMakeLoginData } from './methods';
import dayjs from 'dayjs';

export default {
  ...AuthSignIn, // 로그인

  makeLoginData: AuthMakeLoginData, // 로그인 데이터 생성

  /********************************************************************************************************************
   * 로그인 정보
   * ******************************************************************************************************************/
  async getInfo(req: MyRequest, res: MyResponse) {
    if (req.$$user) {
      try {
        const { is_login, google_id_token, apple_id_token } = param(req, {
          is_login: Param_Boolean({ defaultValue: false }), // 로그인으로 처리할지 여부
          google_id_token: Param_String(), // 구글 ID Token
          apple_id_token: Param_String(), // 애플 ID Token
        });

        if (is_login) {
          // 로그인으로 처리일 경우
          // 로그인 정보 조회
          const loginInfo = await db.UserLogin.info(req, req.$$user.login_key);
          if (!loginInfo) throw api.Error.Unauthorized;

          switch (req.$$user.reg_type) {
            case db.User.RegType.Kakao:
              {
                if (
                  empty(loginInfo.sns_access_token) ||
                  empty(loginInfo.sns_access_token_exp) ||
                  empty(loginInfo.sns_refresh_token)
                ) {
                  throw api.Error.Unauthorized;
                }

                let accessToken: string;

                // Access Token 만료 30분 전인지 확인
                if (dayjs(loginInfo.sns_access_token_exp).subtract(30, 'minutes').isAfter(now())) {
                  accessToken = loginInfo.sns_access_token;
                } else {
                  // Access Token 갱신
                  const refreshTokenInfo = await util.sns.kakaoRefreshToken(loginInfo.sns_refresh_token);

                  accessToken = refreshTokenInfo.accessToken;

                  // 갱신된 토큰 정보 저장
                  await db.UserLogin.edit(
                    req,
                    {
                      sns_access_token: accessToken,
                      sns_access_token_exp: refreshTokenInfo.accessTokenExp,
                      sns_refresh_token: refreshTokenInfo.refreshToken,
                      sns_refresh_token_exp: refreshTokenInfo.refreshTokenExp,
                      update_date: now(),
                    },
                    { login_key: req.$$user.login_key }
                  );
                }

                // 카카오 로그인 사용자 정보 조회
                const kakaoUserInfo = await util.sns.kakaoGetUserInfo(accessToken);
                if (kakaoUserInfo.id !== req.$$user.sns_user_id) {
                  throw api.Error.Unauthorized;
                }
              }
              break;
            case db.User.RegType.Naver:
              {
                if (
                  empty(loginInfo.sns_access_token) ||
                  empty(loginInfo.sns_access_token_exp) ||
                  empty(loginInfo.sns_refresh_token)
                ) {
                  throw api.Error.Unauthorized;
                }

                let accessToken: string;

                // Access Token 만료 30분 전인지 확인
                if (dayjs(loginInfo.sns_access_token_exp).subtract(30, 'minutes').isAfter(now())) {
                  accessToken = loginInfo.sns_access_token;
                } else {
                  // Access Token 갱신
                  const refreshTokenInfo = await util.sns.naverRefreshToken(loginInfo.sns_refresh_token);

                  accessToken = refreshTokenInfo.accessToken;

                  // 갱신된 토큰 정보 저장
                  await db.UserLogin.edit(
                    req,
                    {
                      sns_access_token: accessToken,
                      sns_access_token_exp: refreshTokenInfo.accessTokenExp,
                      sns_refresh_token: refreshTokenInfo.refreshToken,
                      update_date: now(),
                    },
                    { login_key: req.$$user.login_key }
                  );
                }

                // 네이버 로그인 사용자 정보 조회
                const naverUserInfo = await util.sns.naverGetUserInfo(accessToken);
                if (naverUserInfo.id !== req.$$user.sns_user_id) {
                  throw api.Error.Unauthorized;
                }
              }
              break;
            case db.User.RegType.Google:
              {
                if (empty(google_id_token)) throw api.Error.Unauthorized;

                // 구글 로그인 사용자 정보 조회
                const googleUserInfo = await util.sns.googleGetUserInfo(google_id_token);
                if (googleUserInfo.id !== req.$$user.sns_user_id) {
                  throw api.Error.Unauthorized;
                }
              }
              break;
            case db.User.RegType.Apple:
              {
                if (empty(apple_id_token)) throw api.Error.Unauthorized;

                // 애플 로그인 사용자 정보 조회
                const appleUserInfo = await util.sns.googleGetUserInfo(apple_id_token);
                if (appleUserInfo.id !== req.$$user.sns_user_id) {
                  throw api.Error.Unauthorized;
                }
              }
              break;
          }

          await db.trans.begin(req);

          // 로그인 일자 갱신, 로그인 실패 횟수 초기화 초기화
          await db.User.edit(req, { login_date: now(), update_date: now() }, { id: req.$$user.id });

          await db.trans.commit(req);
        }

        // JWT 갱신
        jwt.saveAccessToken(req, res, req.$$user.user_key, req.$$user.reg_type, req.$$user.login_key);

        api.success(res, await AuthMakeLoginData(req, req.$$user));
      } catch (err) {
        jwt.clearAccessToken(res);

        api.success(res, await AuthMakeLoginData(req));
      }
    } else {
      api.success(res, await AuthMakeLoginData(req));
    }
  },

  /********************************************************************************************************************
   * 로그아웃
   * ******************************************************************************************************************/
  async signOut(req: MyRequest, res: MyResponse) {
    if (!req.$$user) throw api.Error.Permission;

    // JWT 삭제
    jwt.clearAccessToken(res);

    api.success(res);
  },
};
