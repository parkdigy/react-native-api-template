import { Knex } from 'knex';
import { TableInsertData } from '@db_models_types';

export interface TDevice {
  /** Primary Key */
  id: number; // PK, AI // int
  /** Others */
  name: string; // 이름 // max:100
  manufacturer: string; // 제조사 // max:100
  create_date: Date; // 등록일자
}

export type TDevice$InsertData = TableInsertData<TDevice, 'id'>;

export default TDevice;

declare module 'knex/types/tables' {
  interface Tables {
    device: Knex.CompositeTableType<TDevice, TDevice$InsertData>;
  }
}
