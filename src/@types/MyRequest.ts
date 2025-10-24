import { Request } from 'express';
import { Knex } from 'knex';
import { TUser } from '@db_models';

export interface MyRequestUser
  extends Pick<
    TUser,
    'id' | 'user_key' | 'uuid' | 'sns_user_id' | 'email' | 'name' | 'nickname' | 'reg_type' | 'is_push_notification'
  > {
  login_key: string;
}

interface MyRequestCommon extends Request {
  $$remoteIpAddress?: string;
  $$dbTransMySql?: Knex.Transaction[];
  $$dbTransMsSql?: Knex.Transaction[];
}

export interface MyRequest extends MyRequestCommon {
  $$user?: MyRequestUser;
}

export interface MyAuthRequest extends MyRequestCommon {
  $$user: MyRequestUser;
}
