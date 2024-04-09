import { Knex } from 'knex';

export type TableInsertData<
  T,
  OmitKeys extends keyof T = never,
  PartialKeys extends keyof Omit<T, OmitKeys> = never,
> = Omit<T, OmitKeys | PartialKeys> & PartialPick<T, PartialKeys>;

export type TableUpdateData<
  T,
  OmitKeys extends keyof T = never,
  RequiredKeys extends keyof Omit<T, OmitKeys> = never,
  Result = PartialOmit<T, OmitKeys | RequiredKeys> & RequiredPick<T, RequiredKeys>,
  FinalResult = { [K in keyof Result]: Result[K] | Knex.Raw },
> = FinalResult;
