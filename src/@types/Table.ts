import { Knex } from 'knex';

export type TableResultWithoutAlias<Record, Keys extends keyof Record> = {
  [K in Keys as K extends `${any}.${infer P}` ? P : K]: Record[K];
};

export type TableRecord<
  T extends Knex.TableNames,
  Alias extends string | undefined = undefined,
  Table = Knex.ResolveTableType<Knex.TableType<T>>
> = {
  [K in keyof Table as K extends string ? (Alias extends string ? `${Alias}.${K}` : K) : never]: Table[K];
};
