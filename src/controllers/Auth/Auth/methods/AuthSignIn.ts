/********************************************************************************************************************
 * 로그인 관련 함수
 * ******************************************************************************************************************/

import AuthMakeLoginData from './AuthMakeLoginData';
import { Param_Date, Param_Enum_Required, Param_String } from '@common_param';
import NickNamePrefix from './nickname_prefix_words.json';
import NickNameAnimal from './nickname_animal_words.json';

const makeNickname = () => {
  const prefix = NickNamePrefix[Math.floor(Math.random() * NickNamePrefix.length)];
  const animal = NickNameAnimal[Math.floor(Math.random() * NickNameAnimal.length)];
  return `${prefix}${animal}`;
};

export const AuthSignIn = {
  /********************************************************************************************************************
   * 로그인
   * ******************************************************************************************************************/
  async signIn(req: MyRequest, res: MyResponse) {
    const {
      _os_,
      type,
      kakao_access_token,
      kakao_access_token_exp,
      kakao_refresh_token,
      kakao_refresh_token_exp,
      naver_access_token,
      naver_access_token_exp,
      naver_refresh_token,
      google_id_token,
      apple_id_token,
    } = param(req, {
      _os_: Param_Enum_Required(['ios', 'aos']), // OS 구분
      type: Param_Enum_Required(db.User.RegType.getList()), // 로그인 구분
      kakao_access_token: Param_String(), // 카카오 액세스 토큰
      kakao_access_token_exp: Param_Date(), // 카카오 액세스 토큰 만료일
      kakao_refresh_token: Param_String(), // 카카오 리프레시 토큰
      kakao_refresh_token_exp: Param_Date(), // 카카오 리프레시 토큰 만료일
      naver_access_token: Param_String(), // 네이버 액세스 토큰
      naver_access_token_exp: Param_Date(), // 네이버 액세스 토큰 만료일
      naver_refresh_token: Param_String(), // 네이버 리프레시 토큰
      google_id_token: Param_String(), // 구글 ID 토큰
      apple_id_token: Param_String(), // 애플 ID 토큰
    });

    let userKey: string;
    let email: string | undefined;
    let nickname: string | undefined;
    let snsUserId: string | undefined = undefined;
    let snsAccessToken: string | undefined = undefined;
    let snsAccessTokenExp: Date | undefined = undefined;
    let snsRefreshToken: string | undefined = undefined;
    let snsRefreshTokenExp: Date | undefined = undefined;

    switch (type) {
      case db.User.RegType.Kakao:
        // 카카오 로그인 일 경우
        {
          if (
            empty(kakao_access_token) ||
            empty(kakao_access_token_exp) ||
            empty(kakao_refresh_token) ||
            empty(kakao_refresh_token_exp)
          ) {
            throw paramError();
          }

          try {
            // 카카오 사용자 정보 조회
            const kakaoUserInfo = await util.sns.kakaoGetUserInfo(kakao_access_token);
            userKey = db.User.getUserKey(type, kakaoUserInfo.id);
            email = kakaoUserInfo.email;
            nickname = kakaoUserInfo.nickname;
            snsUserId = kakaoUserInfo.id;
            snsAccessToken = kakao_access_token;
            snsAccessTokenExp = kakao_access_token_exp;
            snsRefreshToken = kakao_refresh_token;
            snsRefreshTokenExp = kakao_refresh_token_exp;
          } catch {
            // 카카오 사용자 정보 조회 실패
            throw api.Error.auth.signIn.invalidSnsToken;
          }
        }
        break;
      case db.User.RegType.Naver:
        // 네이버 로그인 일 경우
        {
          if (empty(naver_access_token) || empty(naver_access_token_exp) || empty(naver_refresh_token)) {
            throw paramError();
          }

          try {
            // 네이버 사용자 정보 조회
            const naverUserInfo = await util.sns.naverGetUserInfo(naver_access_token);
            userKey = db.User.getUserKey(type, naverUserInfo.id);
            email = naverUserInfo.email;
            nickname = naverUserInfo.nickname;
            snsUserId = naverUserInfo.id;
            snsAccessToken = naver_access_token;
            snsAccessTokenExp = naver_access_token_exp;
            snsRefreshToken = naver_refresh_token;
          } catch {
            // 네이버 사용자 정보 조회 실패
            throw api.Error.auth.signIn.invalidSnsToken;
          }
        }
        break;
      case db.User.RegType.Google:
        // 구글 로그인 일 경우
        {
          if (empty(google_id_token)) {
            throw paramError();
          }
          try {
            // 구글 사용자 정보 조회
            const googleUserInfo = await util.sns.googleGetUserInfo(google_id_token);
            userKey = db.User.getUserKey(type, googleUserInfo.id);
            email = googleUserInfo.email;
            nickname = googleUserInfo.nickname;
            snsUserId = googleUserInfo.id;
          } catch {
            // 구글 사용자 정보 조회 실패
            throw api.Error.auth.signIn.invalidSnsToken;
          }
        }
        break;
      case db.User.RegType.Apple:
        // 애플 로그인 일 경우
        {
          if (empty(apple_id_token)) {
            throw paramError();
          }
          try {
            // 애플 사용자 정보 조회
            const appleUserInfo = await util.sns.appleGetUserInfo(apple_id_token);
            userKey = db.User.getUserKey(type, appleUserInfo.id);
            email = appleUserInfo.email;
            nickname = appleUserInfo.nickname;
            snsUserId = appleUserInfo.id;
          } catch {
            // 애플 사용자 정보 조회 실패
            throw api.Error.auth.signIn.invalidSnsToken;
          }
        }
        break;
    }

    if (!nickname) {
      nickname = makeNickname();
    }

    // 회원정보 조회
    let userInfo = await db.User.info(req, userKey);

    let userId: number;

    // Transaction begin
    await db.trans.begin(req);

    // 회원정보가 없는 경우 가입 처리
    if (!userInfo) {
      userId = (
        await db.User.add(req, {
          user_key: userKey,
          sns_user_id: snsUserId,
          email,
          nickname,
          reg_type: type,
          reg_os: _os_,
          is_push_notification: false,
          login_date: now(),
          status: db.User.Status.On,
          create_date: now(),
          update_date: now(),
        })
      )[0];

      userInfo = await db.User.info(req, userKey);
      if (!userInfo) throw api.newExceptionError();
    } else {
      userId = userInfo.id;
    }

    // 로그인 KEY 생성
    const loginKey = await db.User.newLoginKey(req, userId);

    await db.UserLogin.add(req, {
      login_key: loginKey,
      user_id: userId,
      os: _os_,
      sns_access_token: snsAccessToken,
      sns_access_token_exp: snsAccessTokenExp,
      sns_refresh_token: snsRefreshToken,
      sns_refresh_token_exp: snsRefreshTokenExp,
      expire_date: dayjs().add(Number(process.env.AUTH_JWT_TOKEN_EXPIRES_DAYS), 'days').toDate(),
      create_date: now(),
      update_date: now(),
    });

    // Transaction commit
    await db.trans.commit(req);

    // JWT 발급
    jwt.saveAccessToken(req, res, userKey, type, loginKey);

    api.success(res, await AuthMakeLoginData(req, userInfo));
  },
};

export default AuthSignIn;
