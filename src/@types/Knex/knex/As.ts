declare module 'knex' {
  namespace Knex {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface As<TRecord extends {}, TResult, TAliasRecord extends {} = {}> {
      <ColumnName extends string>(
        columnName: ColumnName
      ): QueryBuilder<
        TRecord,
        UnwrapArrayMember<TResult> extends DeferredKeySelection<
          infer TBase,
          infer TKeys,
          infer THasSelect,
          infer TAliasMapping,
          infer TSingle,
          infer TIntersectProps,
          infer TUnionProps
        >
          ? DeferredKeySelection<
              { [K in ColumnName]: ValueOf<Pick<TBase, TKeys extends keyof TBase ? TKeys : never>> },
              ColumnName,
              THasSelect,
              TAliasMapping,
              TSingle,
              TIntersectProps,
              TUnionProps
            >
          : any,
        UnwrapArrayMember<TResult> extends DeferredKeySelection<infer TBase2, infer TKeys2, any, any, any, any, any>
          ? Pick<TBase2, TKeys2 extends keyof TBase2 ? TKeys2 : never>
          : any
      >;

      <ColumnName extends string, T>(): QueryBuilder<
        TRecord & { [K in ColumnName]: T },
        UnwrapArrayMember<TResult> extends DeferredKeySelection<
          any,
          any,
          infer THasSelect,
          infer TAliasMapping,
          infer TSingle,
          infer TIntersectProps,
          infer TUnionProps
        >
          ? DeferredKeySelection<
              { [K in ColumnName]: T },
              ColumnName,
              THasSelect,
              TAliasMapping,
              TSingle,
              TIntersectProps,
              TUnionProps
            >
          : any,
        UnwrapArrayMember<TResult> extends DeferredKeySelection<infer TBase2, infer TKeys2, any, any, any, any, any>
          ? Pick<TBase2, TKeys2 extends keyof TBase2 ? TKeys2 : never>
          : any
      >;
    }
  }
}
