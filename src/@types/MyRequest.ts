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

export interface MyRequest extends Request {
  $$remoteIpAddress?: string;
  $$dbTransMySql?: Knex.Transaction[];
  $$dbTransMsSql?: Knex.Transaction[];
  $$dbTransMsSqlNextAppPang?: Knex.Transaction[];
  $$user?: MyRequestUser;
}
