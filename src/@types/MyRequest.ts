import { Request } from 'express';
import { Knex } from 'knex';

export interface MyRequestUser {
  id: number;
  email: string;
}

export interface MyRequest extends Request {
  $$remoteIpAddress?: string;
  $$dbTransMySql?: Knex.Transaction[];
  $$dbTransMsSql?: Knex.Transaction[];
  $$user?: MyRequestUser;
}
