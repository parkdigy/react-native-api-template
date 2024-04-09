declare module 'knex' {
  namespace Knex {
    interface Select<TRecord extends {} = any, TResult = unknown[], TAliasRecord extends {} = {}>
      extends AliasQueryBuilder<TRecord, TResult, TAliasRecord>,
        ColumnNameQueryBuilder<TRecord, TResult, TAliasRecord> {
      (): QueryBuilder<TRecord, TResult, TAliasRecord>;

      <
        TInnerRecord extends {} = any,
        TInnerResult = any,
        TInnerAliasRecord extends {} = {},
        TResultRecord = UnwrapArrayMember<TInnerResult> extends DeferredKeySelection<
          infer TInnerBase,
          any,
          any,
          any,
          any,
          any,
          any
        >
          ? TInnerBase
          : {},
        TResultSelection = UnwrapArrayMember<TInnerResult> extends DeferredKeySelection<
          infer TInnerBase,
          infer TInnerKeys,
          any,
          any,
          any,
          any,
          any
        >
          ? DeferredKeySelection.Augment<
              UnwrapArrayMember<TResult>,
              ResolveTableType<RemoveAliasRecord<TRecord>> & TAliasRecord & TInnerBase & TInnerAliasRecord,
              RemoveAliasArrayMember<TInnerKeys, TInnerRecord>
            >
          : TResult,
        TResult2 = TResult extends any[] ? TResultSelection[] : TResultSelection
      >(
        ...subQueryBuilders: readonly QueryBuilder<TInnerRecord, TInnerResult, TInnerAliasRecord>[]
      ): QueryBuilder<TRecord & TResultRecord, TResult2, TAliasRecord & TInnerAliasRecord>;

      // <TResult2 = ArrayIfAlready<TResult, any>, TInnerRecord extends {} = any, TInnerResult = any>(
      //   subQueryBuilders: readonly QueryBuilder<TInnerRecord, TInnerResult, TAliasRecord>[]
      // ): QueryBuilder<TRecord, TResult2, TAliasRecord>;
    }
  }
}
