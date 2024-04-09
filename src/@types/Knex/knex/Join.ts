declare module 'knex' {
  namespace Knex {
    interface Join<TRecord extends {} = any, TResult = unknown[], TAliasRecord extends {} = {}> {
      /********************************************************************************************************************
       * (table, column1, column2)
       * ******************************************************************************************************************/

      /** column1 입력 시 Autocomplete 를 위한 오버로딩 */
      <
        TTable2 extends TableNames,
        TKey2 extends StrKey<ResolveTableType<AliasTableType<TTable2, Alias2>>>,
        Alias2 extends string = TTable2,
      >(
        tableNameWithAlias: `${TTable2} ${Lowercase<'as'>} ${Alias2}` | TTable2,
        columnWithAlias1: TKey2
      ): never;

      /** 실제 사용 오버로딩 */
      <
        TTable2 extends TableNames,
        TKey2 extends StrKey<ResolveTableType<AliasTableType<TTable2, Alias2>>>,
        TKey1 extends StrKey<ResolveTableType<TRecord>>,
        Alias2 extends TableNames | string | undefined = TTable2,
        TRecord1 = ResolveTableType<TRecord>,
        TRecord2 extends {} = TRecord1 & ResolveTableType<AliasTableType<TTable2, Alias2>>,
      >(
        tableNameWithAlias: `${TTable2} ${Lowercase<'as'>} ${Alias2}` | TTable2,
        columnWithAlias1: TKey2,
        columnWithAlias2: TKey1
      ): QueryBuilder<TRecord2, TResult, TAliasRecord>;

      /** column1 에 type mismatch 가 발생하는 문제 해결을 위한 오버로딩 */
      <
        TTable2 extends TableNames,
        TKey1 extends StrKey<ResolveTableType<TRecord>>,
        Alias2 extends TableNames | string | undefined = TTable2,
        TRecord1 = ResolveTableType<TRecord>,
        TRecord2 extends {} = TRecord1 & ResolveTableType<AliasTableType<TTable2, Alias2>>,
      >(
        tableNameWithAlias: `${TTable2} ${Lowercase<'as'>} ${Alias2}` | TTable2,
        columnWithAlias1: string,
        columnWithAlias2: TKey1
      ): QueryBuilder<TRecord2, TResult, TAliasRecord>;

      /********************************************************************************************************************
       * (table, column1, operator, column2)
       * ******************************************************************************************************************/

      /** 실제 사용 오버로딩 */
      <
        TTable2 extends TableNames,
        TKey2 extends StrKey<ResolveTableType<AliasTableType<TTable2, Alias2>>>,
        TKey1 extends StrKey<ResolveTableType<TRecord>>,
        Alias2 extends string = TTable2,
        TRecord1 = ResolveTableType<TRecord>,
        TRecord2 extends {} = TRecord1 & ResolveTableType<AliasTableType<TTable2, Alias2>>,
      >(
        tableNameWithAlias: `${TTable2} ${Lowercase<'as'>} ${Alias2}` | TTable2,
        columnWithAlias1: TKey2,
        operator: string,
        columnWithAlias2: TKey1
      ): QueryBuilder<TRecord2, TResult, TAliasRecord>;

      /** column1 에 type mismatch 가 발생하는 문제 해결을 위한 오버로딩 */
      <
        TTable2 extends TableNames,
        TKey1 extends StrKey<ResolveTableType<TRecord>>,
        Alias2 extends string = TTable2,
        TRecord1 = ResolveTableType<TRecord>,
        TRecord2 extends {} = TRecord1 & ResolveTableType<AliasTableType<TTable2, Alias2>>,
      >(
        tableNameWithAlias: `${TTable2} ${Lowercase<'as'>} ${Alias2}` | TTable2,
        columnWithAlias1: string,
        operator: string,
        columnWithAlias2: TKey1
      ): QueryBuilder<TRecord2, TResult, TAliasRecord>;

      /********************************************************************************************************************
       * (table, (query) => {})
       * ******************************************************************************************************************/

      <
        TTable2 extends TableNames,
        TKey2 extends StrKey<ResolveTableType<AliasTableType<TTable2, Alias2>>>,
        TKey1 extends StrKey<ResolveTableType<TRecord>>,
        Alias2 extends string = TTable2,
        TRecord1 = ResolveTableType<TRecord>,
        TRecord2 extends {} = TRecord1 & ResolveTableType<AliasTableType<TTable2, Alias2>>,
      >(
        tableNameWithAlias: `${TTable2} ${Lowercase<'as'>} ${Alias2}` | TTable2,
        clause: JoinCallback<TKey2, TKey1>
      ): QueryBuilder<TRecord2, TResult, TAliasRecord>;

      /********************************************************************************************************************
       * Sub Builder
       * ******************************************************************************************************************/
      <
        TInnerRecord extends {} = any,
        TInnerResult = any,
        TInnerAliasRecord extends {} = {},
        TAs = UnwrapArrayMember<TInnerResult> extends DeferredKeySelection<
          any,
          infer TInnerResultKeys,
          any,
          any,
          any,
          any,
          any
        >
          ? TInnerResultKeys
          : {},
        TRecord2 = {
          [K in keyof TInnerAliasRecord as K extends string
            ? TAs extends string
              ? `${TAs}.${K}`
              : never
            : never]: TInnerAliasRecord[K];
        },
        TKey2 = keyof TRecord2,
        TRecord3 extends {} = TRecord & TRecord2,
      >(
        tableName: QueryBuilder<TInnerRecord, TInnerResult, TInnerAliasRecord>,
        column1: TKey2
      ): QueryBuilder<TRecord3, TResult, TAliasRecord>;
      <
        TInnerRecord extends {} = any,
        TInnerResult = any,
        TInnerAliasRecord extends {} = {},
        TAs = UnwrapArrayMember<TInnerResult> extends DeferredKeySelection<
          any,
          infer TInnerResultKeys,
          any,
          any,
          any,
          any,
          any
        >
          ? TInnerResultKeys
          : {},
        TRecord2 = {
          [K in keyof TInnerAliasRecord as K extends string
            ? TAs extends string
              ? `${TAs}.${K}`
              : never
            : never]: TInnerAliasRecord[K];
        },
        TKey2 = keyof TRecord2,
        TKey1 = StrKey<ResolveTableType<TRecord>>,
        TRecord3 extends {} = TRecord & TRecord2,
      >(
        tableName: QueryBuilder<TInnerRecord, TInnerResult, TInnerAliasRecord>,
        column1: TKey2,
        column2: TKey1
      ): QueryBuilder<TRecord3, TResult, TAliasRecord>;

      /****************************************************************************************************************/

      // <
      //   TJoinTargetRecord extends {} = any,
      //   TRecord2 extends {} = TRecord & TJoinTargetRecord,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   raw: Raw
      // ): QueryBuilder<TRecord2, TResult2>;

      // <
      //   TTable extends TableNames,
      //   TRecord2 extends {} = ResolveTableType<TRecord> & ResolveTableType<TableType<TTable>>,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   tableName: TTable,
      //   clause: JoinCallback
      // ): QueryBuilder<TRecord2, TResult2>;

      // <
      //   TJoinTargetRecord extends {} = any,
      //   TRecord2 extends {} = TRecord & TJoinTargetRecord,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   tableName: TableDescriptor | AliasDict | QueryCallback,
      //   clause: JoinCallback
      // ): QueryBuilder<TRecord2, TResult2>;

      // <
      //   TJoinTargetRecord extends {} = any,
      //   TRecord2 extends {} = TRecord & TJoinTargetRecord,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   tableName: TableDescriptor | AliasDict | QueryCallback,
      //   columns: { [key: string]: string | number | boolean | Raw }
      // ): QueryBuilder<TRecord2, TResult2>;

      // <
      //   TJoinTargetRecord extends {} = any,
      //   TRecord2 extends {} = TRecord & TJoinTargetRecord,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   tableName: TableDescriptor | AliasDict | QueryCallback,
      //   raw: Raw
      // ): QueryBuilder<TRecord2, TResult2>;

      // <
      //   TTable1 extends TableNames,
      //   TTable2 extends TableNames,
      //   TKey1 extends StrKey<ResolveTableType<TableType<TTable1>>> & StrKey<TRecord1>,
      //   TKey2 extends StrKey<ResolveTableType<TableType<TTable2>>>,
      //   TRecord1 = ResolveTableType<TRecord>,
      //   TRecord2 extends {} = TRecord1 & ResolveTableType<TableType<TTable2>>,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   tableName: TTable2,
      //   column1: `${TTable1}.${TKey1}`,
      //   column2: `${TTable2}.${TKey2}`
      // ): QueryBuilder<TRecord2, TResult2>;

      // <
      //   TTable1 extends TableNames,
      //   TTable2 extends TableNames,
      //   TKey1 extends StrKey<ResolveTableType<TableType<TTable1>>> & StrKey<TRecord1>,
      //   TKey2 extends StrKey<ResolveTableType<TableType<TTable2>>>,
      //   TRecord1 = ResolveTableType<TRecord>,
      //   TRecord2 extends {} = TRecord1 & ResolveTableType<TableType<TTable2>>,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   tableName: TTable2,
      //   column1: `${TTable2}.${TKey2}`,
      //   column2: `${TTable1}.${TKey1}`
      // ): QueryBuilder<TRecord2, TResult2>;
      //
      // <
      //   TJoinTargetRecord extends {} = any,
      //   TRecord2 extends {} = TRecord & TJoinTargetRecord,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   tableName: TableDescriptor | AliasDict | QueryCallback,
      //   column1: string,
      //   column2: string
      // ): QueryBuilder<TRecord2, TResult2>;
      //
      // <
      //   TJoinTargetRecord extends {} = any,
      //   TRecord2 extends {} = TRecord & TJoinTargetRecord,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   tableName: TableDescriptor | AliasDict | QueryCallback,
      //   column1: string,
      //   raw: Raw
      // ): QueryBuilder<TRecord2, TResult2>;
      //
      // <
      //   TTable1 extends TableNames,
      //   TTable2 extends TableNames,
      //   TKey1 extends StrKey<ResolveTableType<TableType<TTable1>>> & StrKey<TRecord1>,
      //   TKey2 extends StrKey<ResolveTableType<TableType<TTable2>>>,
      //   TRecord1 = ResolveTableType<TRecord>,
      //   TRecord2 extends {} = TRecord1 & ResolveTableType<TableType<TTable2>>,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   tableName: TTable2,
      //   column1: `${TTable1}.${TKey1}`,
      //   operator: string,
      //   column2: `${TTable2}.${TKey2}`
      // ): QueryBuilder<TRecord2, TResult2>;
      //
      // <
      //   TTable1 extends TableNames,
      //   TTable2 extends TableNames,
      //   TKey1 extends StrKey<ResolveTableType<TableType<TTable1>>> & StrKey<TRecord1>,
      //   TKey2 extends StrKey<ResolveTableType<TableType<TTable2>>>,
      //   TRecord1 = ResolveTableType<TRecord>,
      //   TRecord2 extends {} = TRecord1 & ResolveTableType<TableType<TTable2>>,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   tableName: TTable2,
      //   column1: `${TTable2}.${TKey2}`,
      //   operator: string,
      //   column2: `${TTable1}.${TKey1}`
      // ): QueryBuilder<TRecord2, TResult2>;
      //
      // <
      //   TJoinTargetRecord extends {} = any,
      //   TRecord2 extends {} = TRecord & TJoinTargetRecord,
      //   TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
      // >(
      //   tableName: TableDescriptor | AliasDict | QueryCallback,
      //   column1: string,
      //   operator: string,
      //   column2: string
      // ): QueryBuilder<TRecord2, TResult2>;
    }
  }
}
