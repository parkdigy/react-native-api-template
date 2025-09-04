/********************************************************************************************************************
 * 로그인 관련 함수
 * ******************************************************************************************************************/

import AuthMakeLoginData from './AuthMakeLoginData';
import { Param_Date, Param_Enum_Required, Param_String, Param_String_Required } from '@common_param';
import NickNamePrefix from './nickname_prefix_words.json';
import NickNameAnimal from './nickname_animal_words.json';
import { TUser$UpdateData } from '@db_models';

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
      _ak_: appKey,
      _iak_: installAppKey,
      _os_: os,
      _os_v_: osVersion,
      _bn_: buildNumber,
      _dm_: deviceModel,
      _dmf_: deviceManufacturer,
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
      _ak_: Param_String_Required(), // 앱 키
      _iak_: Param_String_Required(), // 설치 앱 키
      _os_: Param_Enum_Required(['ios', 'aos']), // OS 구분
      _os_v_: Param_String_Required(), // OS 버전
      _bn_: Param_String_Required(), // 빌드 번호
      _dm_: Param_String_Required(), // 디바이스 모델
      _dmf_: Param_String_Required(), // 디바이스 제조사
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
    let email: string | undefined = undefined;
    let name: string | undefined = undefined;
    let snsUserId: string | undefined = undefined;
    let snsAccessToken: string | undefined = undefined;
    let snsAccessTokenExp: Date | undefined = undefined;
    let snsRefreshToken: string | undefined = undefined;
    let snsRefreshTokenExp: Date | undefined = undefined;

    switch (type) {
      case db.User.RegType.Guest:
        {
          if (req.$$user) throw api.newExceptionError();

          snsUserId = `guest_${installAppKey}`;
          userKey = `guest_${installAppKey}`;
        }
        break;
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
            name = kakaoUserInfo.nickname;
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
            name = naverUserInfo.nickname;
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
            name = googleUserInfo.nickname;
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
            name = appleUserInfo.nickname;
            snsUserId = appleUserInfo.id;
          } catch {
            // 애플 사용자 정보 조회 실패
            throw api.Error.auth.signIn.invalidSnsToken;
          }
        }
        break;
    }

    if (type !== db.User.RegType.Guest && !email) {
      throw api.Error.auth.signIn.notExistsEmail;
    }

    // 회원정보 조회
    let userInfo = await db.User.info(req, userKey);

    let userId: number;

    // Transaction begin
    await db.trans.begin(req);

    // 비회원 상태에서 로그인 한 경우, SNS 로그인이 신규 가입 인 경우 데이터 이전
    if (req.$$user && req.$$user.reg_type === db.User.RegType.Guest && !userInfo) {
      await db.User.editWithUpdateDate(
        req,
        {
          user_key: userKey,
          sns_user_id: snsUserId,
          email: ifUndefined(email, null),
          name: ifUndefined(name, null),
          reg_type: type,
          reg_os: os,
          reg_app_key: appKey,
          reg_install_app_key: installAppKey,
          login_date: now(),
          status: db.User.Status.On,
        },
        { id: req.$$user.id }
      );

      userInfo = await db.User.info(req, userKey);
    }

    // 회원정보가 없는 경우 가입 처리
    if (!userInfo) {
      const uuid = await db.User.newUUID(req);

      userId = (
        await db.User.addWithCreateUpdateDate(req, {
          user_key: userKey,
          sns_user_id: snsUserId,
          uuid,
          email: ifUndefined(email, null),
          name: ifUndefined(name, null),
          nickname: makeNickname(),
          reg_type: type,
          reg_os: os,
          is_push_notification: false,
          reg_app_key: appKey,
          reg_install_app_key: installAppKey,
          login_date: now(),
          status: db.User.Status.On,
        })
      )[0];

      userInfo = await db.User.info(req, userKey);
      if (!userInfo) throw api.newExceptionError();

      util.slack.sendAdminAlarm([
        ':child: 신규 회원 가입',
        `회원 ID : ${userId}`,
        `이름 : ${name}`,
        `OS : ${os}(${osVersion})`,
        `기기 : ${deviceModel} - ${deviceManufacturer}`,
        `가입 구분 : ${type}`,
      ]);
    } else {
      const updateData: Omit<TUser$UpdateData, 'update_date'> = { login_date: now() };

      if (notEmpty(email) && userInfo.email !== email) {
        updateData.email = email;
      }
      if (notEmpty(name) && userInfo.name !== name) {
        updateData.name = name;
      }

      await db.User.editWithUpdateDate(req, updateData, { id: userInfo.id });

      userId = userInfo.id;
    }

    // 로그인 KEY 생성
    const loginKey = await db.User.newLoginKey(userId);

    const deviceId = await db.Device.getId(req, deviceModel, deviceManufacturer);

    const userLoginAddEditData = {
      login_key: loginKey,
      os,
      os_version: osVersion,
      build_number: buildNumber,
      device_id: deviceId,
      expire_date: dayjs().add(Number(process.env.AUTH_JWT_TOKEN_EXPIRES_DAYS), 'days').toDate(),
    };

    if (await db.UserLogin.exists(req, { user_id: userId, app_key: appKey })) {
      await db.UserLogin.editWithUpdateDate(req, userLoginAddEditData, { user_id: userId, app_key: appKey });
    } else {
      await db.UserLogin.addWithCreateUpdateDate(req, {
        user_id: userId,
        app_key: appKey,
        ...userLoginAddEditData,
      });
    }

    if (type !== db.UserLoginSns.Type.Guest) {
      if (await db.UserLoginSns.exists(req, { type, sns_user_id: snsUserId })) {
        await db.UserLoginSns.editWithUpdateDate(
          req,
          {
            sns_access_token: snsAccessToken,
            sns_access_token_exp: snsAccessTokenExp,
            sns_refresh_token: snsRefreshToken,
            sns_refresh_token_exp: snsRefreshTokenExp,
          },
          { type, sns_user_id: snsUserId }
        );
      } else {
        await db.UserLoginSns.addWithCreateUpdateDate(req, {
          type,
          sns_user_id: snsUserId,
          sns_access_token: snsAccessToken,
          sns_access_token_exp: snsAccessTokenExp,
          sns_refresh_token: snsRefreshToken,
          sns_refresh_token_exp: snsRefreshTokenExp,
        });
      }
    }

    // Transaction commit
    await db.trans.commit(req);

    // JWT 발급
    jwt.saveAccessToken(req, res, userKey, type, loginKey);

    api.success(res, await AuthMakeLoginData(req, userInfo));
  },
};

export default AuthSignIn;
