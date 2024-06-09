/********************************************************************************************************************
 * FCM 모듈
 * ******************************************************************************************************************/

import FirebaseAdmin from 'firebase-admin';
import { BaseMessage, TokenMessage, TopicMessage } from 'firebase-admin/lib/messaging';
import { TFcmToken$Os } from '@db_models';

/** 발송 대상 - FCM 토픽 */
const TopicBase = {
  all: '전체',
  aos: 'Android',
  ios: 'iOS',
} as const;
type Topic = keyof typeof TopicBase;
const Topic = {
  ...TopicBase,
  getTopicsByOs(os: TFcmToken$Os): Topic[] {
    switch (os) {
      case TFcmToken$Os.Ios:
        return ['all', 'ios'];
      case TFcmToken$Os.Android:
        return ['all', 'aos'];
      default:
        return ['all'];
    }
  },
};

export default {
  Topic,

  /********************************************************************************************************************
   * 메시지 생성
   * ******************************************************************************************************************/
  _makeMessage(title?: string, body?: string, data?: Dict<string>) {
    if (empty(title) && empty(body) && empty(data)) throw api.newExceptionError();

    const message: BaseMessage = {};

    if (body) {
      message.notification = { title, body };
      message.android = {
        priority: 'high',
        notification: {
          title,
          body,
          icon: 'ic_notification',
          color: '#2368E7',
          priority: 'high',
          channelId: 'default',
        },
      };
    }

    if (data) {
      message.data = data;
    }

    return message;
  },

  /********************************************************************************************************************
   * 토큰 추가
   * ******************************************************************************************************************/
  async addToken(
    req: MyRequest,
    token: string,
    {
      userId,
      os,
      osVersion,
      buildNumber,
      deviceModel,
      deviceManufacturer,
      isPushNotification,
    }: {
      userId: number;
      os: TFcmToken$Os;
      osVersion: string;
      buildNumber: string;
      deviceModel: string;
      deviceManufacturer: string;
      isPushNotification: boolean;
    }
  ) {
    await db.FcmToken.addEdit(req, token, userId, os, osVersion, buildNumber, deviceModel, deviceManufacturer);

    if (isPushNotification) {
      await this.subscribeTokensToAllTopic(os, [token]);
    }
  },

  /********************************************************************************************************************
   * 회원 토픽 구독
   * ******************************************************************************************************************/
  async subscribeUserToTopic(req: MyRequest, userId: number, topic: Topic) {
    const list = await db.FcmToken.getBuilder(req).select('id').where('user_id', userId);

    for (const info of list) {
      await this._firebaseSubscribeToTopic(info.id, topic);
    }
  },

  /********************************************************************************************************************
   * 회원 모든 토픽 구독
   * ******************************************************************************************************************/
  async subscribeUserToAllTopic(req: MyRequest, userId: number) {
    const list = await db.FcmToken.getBuilder(req).select('id', 'os').where('user_id', userId);

    for (const info of list) {
      const topics = Topic.getTopicsByOs(info.os);
      for (const topic of topics) {
        await this._firebaseSubscribeToTopic(info.id, topic);
      }
    }
  },

  /********************************************************************************************************************
   * 회원 모든 토픽 구독 해제
   * ******************************************************************************************************************/
  async unsubscribeUserFromAllTopic(req: MyRequest, userId: number) {
    const list = await db.FcmToken.getBuilder(req).select('id', 'os').where('user_id', userId);

    for (const info of list) {
      const topics = Topic.getTopicsByOs(info.os);
      for (const topic of topics) {
        await this._firebaseUnsubscribeFromTopic(info.id, topic);
      }
    }
  },

  /********************************************************************************************************************
   * 토큰의 모든 토픽 구독 해제
   * ******************************************************************************************************************/
  async subscribeTokensToAllTopic(os: TFcmToken$Os, tokens: string[]) {
    if (notEmpty(tokens)) {
      const topics = Topic.getTopicsByOs(os);
      for (const topic of topics) {
        await this._firebaseUnsubscribeFromTopic(tokens, topic);
      }
    }
  },

  /********************************************************************************************************************
   * 토큰의 모든 토픽 구독 해제
   * ******************************************************************************************************************/
  async unsubscribeTokensFromAllTopic(os: TFcmToken$Os, tokens: string[]) {
    if (notEmpty(tokens)) {
      const topics = Topic.getTopicsByOs(os);
      for (const topic of topics) {
        await this._firebaseUnsubscribeFromTopic(tokens, topic);
      }
    }
  },

  /********************************************************************************************************************
   * 토큰으로 전송
   * ******************************************************************************************************************/
  async _sendToToken(token: string, title?: string, body?: string, data?: Dict<string>) {
    const message = {
      token,
      ...this._makeMessage(title, body, data),
    } as TokenMessage;

    await FirebaseAdmin.messaging().send(message);
  },

  /********************************************************************************************************************
   * 토큰으로 푸시알림 전송
   * ******************************************************************************************************************/
  async sendNotificationToToken(token: string, title: string, body: string, data?: Dict<string>) {
    return this._sendToToken(token, title, body, data);
  },

  /********************************************************************************************************************
   * 토큰으로 데이터 전송
   * ******************************************************************************************************************/
  async sendDataToToken(token: string, data: Dict<string>) {
    return this._sendToToken(token, undefined, undefined, data);
  },

  /********************************************************************************************************************
   * 회원에게 전송
   * ******************************************************************************************************************/
  async _sendToUser(req: MyRequest, userId: number, title?: string, body?: string, data?: Dict<string>) {
    const list = await db.FcmToken.listOfUser(req, userId);
    if (notEmpty(list)) {
      const tokenOs = list.reduce((acc, { id, os }) => {
        acc[id] = os;
        return acc;
      }, {} as Dict<TFcmToken$Os>);

      const defaultMessage = this._makeMessage(title, body, data);
      const messages = list.map<TokenMessage>(({ id }) => ({ token: id, ...defaultMessage }));
      const result = await FirebaseAdmin.messaging().sendEach(messages);
      if (result.failureCount > 0) {
        for (const item of result.responses) {
          if (!item.success && item.error) {
            if (
              contains(
                ['messaging/invalid-registration-token', 'messaging/registration-token-not-registered'],
                item.error.code
              )
            ) {
              const removeId = (messages[result.responses.indexOf(item)] as TokenMessage).token;
              await db.FcmToken.remove(req, { id: removeId });
              await this.unsubscribeTokensFromAllTopic(tokenOs[removeId], [removeId]);
            }
          }
        }
      }
    }
  },

  /********************************************************************************************************************
   * 회원에게 푸시알림 전송
   * ******************************************************************************************************************/
  async sendNotificationToUser(req: MyRequest, userId: number, title: string, body: string, data?: Dict<string>) {
    return this._sendToUser(req, userId, title, body, data);
  },

  /********************************************************************************************************************
   * 회원에게 데이터 전송
   * ******************************************************************************************************************/
  async sendDataToUser(req: MyRequest, userId: number, data: Dict<string>) {
    return this._sendToUser(req, userId, undefined, undefined, data);
  },

  /********************************************************************************************************************
   * 토픽에 전송
   * ******************************************************************************************************************/
  async _sendToTopic(topic: Topic, title?: string, body?: string, data?: Dict<string>) {
    const message = {
      topic,
      ...this._makeMessage(title, body, data),
    } as TopicMessage;

    await FirebaseAdmin.messaging().send(message);
  },

  /********************************************************************************************************************
   * 토픽에 푸시알림 전송
   * ******************************************************************************************************************/
  async sendNotificationToTopic(topic: Topic, title: string, body: string, data?: Dict<string>) {
    return this._sendToTopic(topic, title, body, data);
  },

  /********************************************************************************************************************
   * 토픽에 데이터 전송
   * ******************************************************************************************************************/
  async sendDataToTopic(topic: Topic, data: Dict<string>) {
    return this._sendToTopic(topic, undefined, undefined, data);
  },

  /********************************************************************************************************************
   * (Firebase) 토픽 구독
   * ******************************************************************************************************************/
  _firebaseSubscribeToTopic(registrationTokenOrTokens: string | string[], topic: string) {
    return FirebaseAdmin.messaging().subscribeToTopic(
      registrationTokenOrTokens,
      env.isProduction ? topic : `dev_${topic}`
    );
  },

  /********************************************************************************************************************
   * (Firebase) 토픽 구독 해제
   * ******************************************************************************************************************/
  _firebaseUnsubscribeFromTopic(registrationTokenOrTokens: string | string[], topic: string) {
    return FirebaseAdmin.messaging().unsubscribeFromTopic(
      registrationTokenOrTokens,
      env.isProduction ? topic : `dev_${topic}`
    );
  },
};
