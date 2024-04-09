declare module 'knex' {
  namespace Knex {
    interface TypePreservingAggregation<
      TRecord extends {} = any,
      TResult = unknown[],
      TAliasRecord extends {} = {},
      TRealRecord extends {} = ResolveTableType<TRecord>,
      TAsRecord = {
        [K in keyof TRealRecord as K extends string ? `${K} ${Lowercase<'as'>} ${any}` : never]: TRealRecord[K];
      },
      TDictRecord = {
        [key: string]: keyof TRealRecord | Raw;
      },
    > {
      <
        ColNames extends InferrableColumnDescriptor<TRealRecord> | keyof TAsRecord | TDictRecord,
        TAliasRecord2 = ColNames extends TDictRecord
          ? {
              [K in keyof ColNames]: ColNames[K] extends keyof TRealRecord
                ? TRealRecord[ColNames[K]]
                : ColNames[K] extends Raw<infer Type>
                  ? Type extends Dict
                    ? ValueOf<Type>
                    : Type
                  : never;
            }
          : {
              [K in ColNames extends `${any} ${Lowercase<'as'>} ${infer Alias}`
                ? Alias
                : never]: ColNames extends `${infer Field} ${Lowercase<'as'>} ${any}`
                ? ValueOf<{
                    [CK in keyof TRecord as CK extends Field ? CK : never]: TRecord[CK];
                  }>
                : unknown;
            },
        TResultSelection = DeferredKeySelection.Augment<
          UnwrapArrayMember<TResult>,
          ResolveTableType<RemoveAliasRecord<TRecord>> & TAliasRecord & TAliasRecord2,
          ColNames extends TDictRecord
            ? keyof ColNames extends string
              ? keyof ColNames
              : never
            : RemoveAliasArrayMember<ColNames, TRecord>
        >,
        TResult2 = TResult extends any[] ? TResultSelection[] : TResultSelection,
      >(
        colNames: ColNames
      ): QueryBuilder<TRecord, TResult2, TAliasRecord & TAliasRecord2>;
    }
  }
}
