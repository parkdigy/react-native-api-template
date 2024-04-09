declare module 'knex' {
  namespace Knex {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface AliasQueryBuilder<TRecord extends {} = any, TResult = unknown[], TAliasRecord extends {} = {}> {
      // <
      //   AliasUT extends InferrableColumnDescriptor<ResolveTableType<TRecord>>[],
      //   TResult2 = ArrayIfAlready<
      //     TResult,
      //     DeferredKeySelection.Augment<
      //       UnwrapArrayMember<TResult>,
      //       ResolveTableType<RemoveAliasRecord<TRecord>>,
      //       IncompatibleToAlt<RemoveAliasArrayMember<AliasUT, TRecord>, string, never>,
      //       IntersectAliases<RemoveAliasArray<AliasUT, TRecord>>
      //     >
      //   >
      // >(
      //   ...aliases1: AliasUT
      // ): QueryBuilder<TRecord, TResult2>;
      //
      //   <
      //     AliasUT extends InferrableColumnDescriptor<ResolveTableType<TRecord>>[],
      //     TResult2 = ArrayIfAlready<
      //       TResult,
      //       DeferredKeySelection.Augment<
      //         UnwrapArrayMember<TResult>,
      //         ResolveTableType<RemoveAliasRecord<TRecord>>,
      //         IncompatibleToAlt<RemoveAliasArrayMember<AliasUT, TRecord>, string, never>,
      //         IntersectAliases<RemoveAliasArray<AliasUT, TRecord>>
      //       >
      //     >
      //   >(
      //     aliases2: AliasUT
      //   ): QueryBuilder<TRecord, TResult2>;
      //
      //   <
      //     AliasUT extends (Dict | string)[],
      //     TResult2 = ArrayIfAlready<
      //       TResult,
      //       DeferredKeySelection.Augment<
      //         UnwrapArrayMember<TResult>,
      //         ResolveTableType<RemoveAliasRecord<TRecord>>,
      //         IncompatibleToAlt<RemoveAliasArrayMember<AliasUT, TRecord>, string, never>,
      //         IntersectAliases<RemoveAliasArray<AliasUT, TRecord>>
      //       >
      //     >
      //   >(
      //     ...aliases3: AliasUT
      //   ): QueryBuilder<TRecord, TResult2>;
      //   <
      //     AliasUT extends (Dict | string)[],
      //     TResult2 = ArrayIfAlready<
      //       TResult,
      //       DeferredKeySelection.Augment<
      //         UnwrapArrayMember<TResult>,
      //         RemoveAliasRecord<TRecord>,
      //         IncompatibleToAlt<RemoveAliasArrayMember<AliasUT, TRecord>, string, never>,
      //         IntersectAliases<RemoveAliasArray<AliasUT, TRecord>>
      //       >
      //     >
      //   >(
      //     aliases4: AliasUT
      //   ): QueryBuilder<TRecord, TResult2>;
    }
  }
}
