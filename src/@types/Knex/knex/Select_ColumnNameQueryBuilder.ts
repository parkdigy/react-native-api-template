declare module 'knex' {
  namespace Knex {
    type RawResult<T> = T extends Raw<infer R> ? R : never;

    type ExtractRawResultKeys<T extends any[]> = T extends (infer M)[] | infer M
      ? M extends Raw
        ? keyof RawResult<M>
        : M
      : never;

    type MergeOptionalPropertyNames<T> = {
      [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
    }[keyof T];

    type MergeProperties<L, R, K extends keyof L & keyof R> = {
      [P in K]: L[P] | Exclude<R[P], undefined>;
    };

    type MergeId<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

    type MergeTwo<L, R> = MergeId<
      Pick<L, Exclude<keyof L, keyof R>> &
        Pick<R, Exclude<keyof R, MergeOptionalPropertyNames<R>>> &
        Pick<R, Exclude<MergeOptionalPropertyNames<R>, keyof L>> &
        MergeProperties<L, R, MergeOptionalPropertyNames<R> & keyof L>
    >;

    export type RawResultMerge<A extends readonly [...any]> = A extends [infer L, ...infer R]
      ? L extends Raw<infer RResult>
        ? keyof RResult extends string | number
          ? MergeTwo<RResult, RawResultMerge<R>>
          : any
        : RawResultMerge<R>
      : {};

    interface ColumnNameQueryBuilder<
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
      /****************************************************************************************************************/
      <
        ColNameUT extends (
          | InferrableColumnDescriptor<TRealRecord>
          | keyof TAsRecord
          | '*'
          | `${any}.*`
          | TDictRecord
          | Raw
        )[] = [],
        RawRecord = RawResultMerge<ColNameUT>,
        TAliasRecord2 = {
          [K in keyof ColNameUT as ColNameUT[K] extends `${any} ${Lowercase<'as'>} ${infer Alias}`
            ? Alias
            : never]: ColNameUT[Exclude<K, number>] extends `${infer Field} ${Lowercase<'as'>} ${any}`
            ? ValueOf<{
                [CK in keyof TRecord as CK extends Field ? CK : never]: TRecord[CK];
              }>
            : unknown;
        } & RawRecord,
        TResultSelection = DeferredKeySelection.Augment<
          UnwrapArrayMember<TResult>,
          ResolveTableType<RemoveAliasRecord<TRecord>> & TAliasRecord & TAliasRecord2,
          RemoveAliasArrayMember<ExtractRawResultKeys<ColNameUT>, TRecord>
        >,
        TResult2 = TResult extends any[] ? TResultSelection[] : TResultSelection,
      >(
        ...columnNames1: ColNameUT
      ): QueryBuilder<TRecord, TResult2, TAliasRecord & TAliasRecord2>;

      // 개발툴 Autocomplete 를 위한 선헌 반드시 위 선언의 아래에 있어야 함
      <ColNameUT extends keyof ResolveTableType<TRecord>>(...columnNames2: ColNameUT[]): never;

      // <
      //   ColName extends keyof TRealRecord | keyof TAsRecord,
      //   TAliasRecord = {
      //     [K in keyof ColName as ColName[K] extends `${any} ${Lowercase<'as'>} ${infer Alias}`
      //       ? Alias
      //       : never]: ColName[K] extends `${infer Field} ${Lowercase<'as'>} ${any}`
      //       ? ValueOf<{
      //         [CK in keyof TRecord as CK extends Field ? CK : never]: TRecord[CK];
      //       }>
      //       : unknown;
      //   },
      //   TResult2 = DeferredKeySelection.Augment<
      //     UnwrapArrayMember<TResult>,
      //     ResolveTableType<RemoveAliasRecord<TRecord>> & TAliasRecord,
      //     RemoveAliasArrayMember<ColName, TRecord>
      //     >[]
      //   >(
      //   columnNames2: ColName
      // ): QueryBuilder<TRecord, TResult2>;

      // <
      //   ColNameUT extends (keyof TAsRecord)[],
      //   TAliasRecord = {
      //     [K in keyof ColNameUT as ColNameUT[K] extends `${any} ${Lowercase<'as'>} ${infer Alias}`
      //       ? Alias
      //       : never]: ColNameUT[K] extends `${infer Field} ${Lowercase<'as'>} ${any}`
      //       ? ValueOf<{
      //           [CK in keyof TRecord as CK extends Field ? CK : never]: TRecord[CK];
      //         }>
      //       : unknown;
      //   },
      //   TResult2 = DeferredKeySelection.Augment<
      //     UnwrapArrayMember<TResult>,
      //     ResolveTableType<RemoveAliasRecord<TRecord>> & TAliasRecord,
      //     RemoveAliasArrayMember<ColNameUT, TRecord>
      //   >[]
      // >(
      //   ...columnNames2: ColNameUT
      // ): QueryBuilder<TRecord, TResult2>;

      // <
      //   ColNameUT extends keyof ResolveTableType<TRecord>,
      //   TResult2 = DeferredKeySelection.Augment<
      //     UnwrapArrayMember<TResult>,
      //     ResolveTableType<RemoveAliasRecord<TRecord>>,
      //     ColNameUT & string
      //   >[]
      // >(
      //   columnName3: readonly ColNameUT[]
      // ): QueryBuilder<TRecord, TResult2>;

      // For non-inferrable column selection, we will allow consumer to
      // specify result type and if not widen the result to entire record type with any omissions permitted
      // <
      //   TResult2 = DeferredKeySelection.Augment<
      //     UnwrapArrayMember<TResult>,
      //     SafePartial<RemoveAliasRecord<TRecord>>,
      //     keyof RemoveAliasRecord<TRecord> & string
      //     >[]
      //   >(
      //   ...columnNames: readonly ColumnDescriptor<TRecord, TResult>[]
      // ): QueryBuilder<TRecord, TResult2>;

      // <
      //   TResult2 = DeferredKeySelection.Augment<
      //     UnwrapArrayMember<TResult>,
      //     SafePartial<TRecord>,
      //     keyof TRecord & string
      //     >[]
      //   >(
      //   columnNames: readonly ColumnDescriptor<TRecord, TResult>[]
      // ): QueryBuilder<TRecord, TResult2>;
    }
  }
}
