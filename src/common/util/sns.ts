/********************************************************************************************************************
 * SNS 모듈
 * ******************************************************************************************************************/

import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import FirebaseAdmin from 'firebase-admin';

export default {
  /********************************************************************************************************************
   * 카카오 로그인 사용자 정보
   * ******************************************************************************************************************/
  async kakaoGetUserInfo(accessToken: string) {
    try {
      const axiosRes = await axios({
        method: 'post',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          charset: 'utf-8',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!axiosRes.data || !axiosRes.data.id) {
        throw api.newExceptionError();
      }

      const id = `${axiosRes.data.id}`;
      const email: string | undefined = axiosRes.data.kakao_account?.email;
      const nickname: string | undefined = axiosRes.data.kakao_account?.profile?.nickname;

      return { id, email, nickname };
    } catch (err) {
      const resData = (err as AxiosError).response?.data as Dict;
      if (resData && typeof resData === 'object' && resData.code === -401) {
        throw api.Error.Unauthorized;
      } else {
        throw api.newExceptionError();
      }
    }
  },

  /********************************************************************************************************************
   * 카카오 로그인 토큰 갱신
   * ******************************************************************************************************************/
  async kakaoRefreshToken(refreshToken: string) {
    try {
      const axiosRes = await axios({
        method: 'post',
        url: 'https://kauth.kakao.com/oauth/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          charset: 'utf-8',
        },
        data: {
          grant_type: 'refresh_token',
          client_id: process.env.KAKAO_API_KEY,
          refresh_token: refreshToken,
          client_secret: process.env.KAKAO_API_SECRET,
        },
      });

      if (!axiosRes.data || empty(axiosRes.data.access_token) || empty(axiosRes.data.expires_in)) {
        throw api.newExceptionError();
      }

      const accessToken = axiosRes.data.access_token as string;
      const accessTokenExpiresIn = axiosRes.data.expires_in as number;
      const accessTokenExp = dayjs().add(accessTokenExpiresIn, 'seconds').toDate();
      const newRefreshToken: string | undefined = ifNull(axiosRes.data.refresh_token, undefined);
      const newRefreshTokenExpiresIn: number | undefined = ifNull(axiosRes.data.refresh_token_expires_in, undefined);
      const newRefreshTokenExp: Date | undefined = newRefreshTokenExpiresIn
        ? dayjs().add(newRefreshTokenExpiresIn, 'seconds').toDate()
        : undefined;

      return {
        accessToken,
        accessTokenExp,
        refreshToken: newRefreshToken,
        refreshTokenExp: newRefreshTokenExp,
      };
    } catch (err) {
      const resData = (err as AxiosError).response?.data as Dict;
      if (resData && typeof resData === 'object' && resData.error === 'invalid_grant') {
        throw api.Error.Unauthorized;
      } else {
        throw api.newExceptionError();
      }
    }
  },

  /********************************************************************************************************************
   * 네이버 로그인 사용자 정보
   * ******************************************************************************************************************/
  async naverGetUserInfo(accessToken: string) {
    try {
      const axiosRes = await axios({
        method: 'post',
        url: 'https://openapi.naver.com/v1/nid/me',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          charset: 'utf-8',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!axiosRes.data || axiosRes.data.resultcode !== '00' || !axiosRes.data.response) {
        throw api.newExceptionError();
      }

      const id: string = axiosRes.data.response.id;
      const email: string | undefined = axiosRes.data.response.email;
      const nickname: string | undefined = axiosRes.data.response.name;

      return { id, email, nickname };
    } catch (err) {
      const resData = (err as AxiosError).response?.data as Dict;
      if (resData && typeof resData === 'object' && resData.resultcode === '024') {
        throw api.Error.Unauthorized;
      } else {
        throw api.newExceptionError();
      }
    }
  },

  /********************************************************************************************************************
   * 네이버 로그인 토큰 갱신
   * ******************************************************************************************************************/
  async naverRefreshToken(refreshToken: string) {
    try {
      const axiosRes = await axios({
        method: 'post',
        url: 'https://nid.naver.com/oauth2.0/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          charset: 'utf-8',
        },
        data: {
          grant_type: 'refresh_token',
          client_id: process.env.NAVER_API_KEY,
          refresh_token: refreshToken,
          client_secret: process.env.NAVER_API_SECRET,
        },
      });

      if (!axiosRes.data || empty(axiosRes.data.access_token) || empty(axiosRes.data.expires_in)) {
        throw api.newExceptionError();
      }

      const accessToken = axiosRes.data.access_token as string;
      const accessTokenExpiresIn = axiosRes.data.expires_in as number;
      const accessTokenExp = dayjs().add(accessTokenExpiresIn, 'seconds').toDate();
      const newRefreshToken: string | undefined = ifNull(axiosRes.data.refresh_token, undefined);

      return {
        accessToken,
        accessTokenExp,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      const resData = (err as AxiosError).response?.data as Dict;
      if (resData && typeof resData === 'object' && resData.error === 'invalid_grant') {
        throw api.Error.Unauthorized;
      } else {
        throw api.newExceptionError();
      }
    }
  },

  /********************************************************************************************************************
   * 구글 로그인 사용자 정보
   * ******************************************************************************************************************/
  async googleGetUserInfo(accessToken: string) {
    try {
      const info = await FirebaseAdmin.auth().verifyIdToken(accessToken);
      const userInfo = await FirebaseAdmin.auth().getUser(info.uid);
      return { id: info.uid, email: userInfo.email, nickname: userInfo.displayName };
    } catch {
      throw api.Error.Unauthorized;
    }
  },

  /********************************************************************************************************************
   * 애플 로그인 사용자 정보
   * ******************************************************************************************************************/
  async appleGetUserInfo(accessToken: string) {
    try {
      const info = await FirebaseAdmin.auth().verifyIdToken(accessToken);
      const userInfo = await FirebaseAdmin.auth().getUser(info.uid);
      return { id: info.uid, email: userInfo.email, nickname: userInfo.displayName };
    } catch {
      throw api.Error.Unauthorized;
    }
  },
};
