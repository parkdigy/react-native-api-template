import { MySqlQuery } from '@db_query_common';
import { Knex } from 'knex';

const tableName: Knex.TableNames = 'device';
type tableName = typeof tableName;

export default class Device extends MySqlQuery<tableName> {
  constructor() {
    super(tableName);
  }

  async getId(req: MyRequest, name: string, manufacturer: string) {
    const info = await this.find(req, { name }).select('id');
    if (info) {
      return info.id;
    } else {
      return (await this.addWithCreateDate(req, { name, manufacturer }))[0];
    }
  }
}

export { Device };
