declare module 'knex' {
  namespace Knex {
    type ValueOf<T> = T[keyof T];

    /********************************************************************************************************************
     * AliasTableType
     * ******************************************************************************************************************/
    type AliasTableType<
      T extends Knex.TableNames,
      Alias extends string | undefined = undefined,
      Table = Knex.TableType<T>,
      Table2 = Table extends Knex.CompositeTableType<unknown> ? Table['base'] : Table,
    > =
      Table extends Knex.CompositeTableType<unknown>
        ? Knex.CompositeTableType<
            {
              [K in keyof Table2 as K extends string
                ? Alias extends undefined
                  ? K
                  : `${Alias}.${K}`
                : never]: Table2[K];
            },
            Table['insert'],
            Table['update'],
            Table['upsert']
          >
        : {
            [K in keyof Table as K extends string ? (Alias extends undefined ? K : `${Alias}.${K}`) : never]: Table[K];
          };

    /********************************************************************************************************************
     * ArrayMember
     * ******************************************************************************************************************/
    export type ArrayMember<T> = T extends (infer M)[] ? M : never;

    /********************************************************************************************************************
     * RemoveAlias
     * ******************************************************************************************************************/
    type RemoveAlias<
      T,
      TRecord extends {},
      TResolveRecord extends {} = Knex.ResolveTableType<TRecord>,
      TFoundRecord extends {} = T extends `${infer Alias}.*`
        ? { [K in keyof TResolveRecord as K extends `${Alias}.${any}` ? K : never]: TResolveRecord[K] }
        : TResolveRecord,
      TFinalRecord = RemoveAliasRecord<TFoundRecord>,
    > = T extends '*'
      ? keyof TRecord
      : T extends `${any}.*`
        ? keyof TFinalRecord
        : T extends `${any} ${Lowercase<'as'>} ${infer M}`
          ? M
          : T extends `${any}.${infer M}` | infer M
            ? M
            : never;

    /********************************************************************************************************************
     * RemoveAliasArrayMember
     * ******************************************************************************************************************/
    type RemoveAliasArrayMember<T, TRecord extends {}> = T extends (infer M)[] | infer M
      ? M extends { [key: string]: any }
        ? RemoveAlias<keyof M, TRecord>
        : RemoveAlias<M, TRecord>
      : never;

    /********************************************************************************************************************
     * RemoveAliasArray
     * ******************************************************************************************************************/
    type RemoveAliasArray<T, TRecord extends {}> = {
      [K in keyof T]: T[K] extends { [key: string]: any }
        ? RemoveAlias<keyof T[K], TRecord>
        : RemoveAlias<T[K], TRecord>;
    };

    /********************************************************************************************************************
     * RemoveAliasRecord
     * ******************************************************************************************************************/
    type RemoveAliasRecord<
      Record extends {},
      Record2 extends {} = {},
      CompositeBaseRecord = Record extends Knex.CompositeTableType<unknown> ? Record['base'] : Record,
    > =
      Record extends Knex.CompositeTableType<unknown>
        ? Knex.CompositeTableType<
            {
              [K in keyof CompositeBaseRecord as RemoveAlias<K, Record>]: CompositeBaseRecord[K];
            } & Record2,
            Record['insert'],
            Record['update'],
            Record['upsert']
          >
        : {
            [K in keyof Record as RemoveAlias<K, Record>]: Record[K];
          };

    /********************************************************************************************************************
     * AliasRecord
     * ******************************************************************************************************************/
    type AliasRecord<
      T,
      Record extends {},
      CompositeBaseRecord = Record extends Knex.CompositeTableType<unknown> ? Record['base'] : Record,
    > = {
      [K in keyof T as T[K] extends `${any} ${Lowercase<'as'>} ${infer Alias}`
        ? Alias
        : never]: T[K] extends `${infer Field} ${Lowercase<'as'>} ${any}`
        ? ValueOf<{
            [CK in keyof CompositeBaseRecord as CK extends Field ? CK : never]: CompositeBaseRecord[CK];
          }>
        : unknown;
    };
  }
}
