declare module 'knex' {
  namespace Knex {
    interface JoinCallback<TKey1, TKey2> {
      (this: JoinClause<TKey1, TKey2>, join: JoinClause<TKey1, TKey2>): void;
    }

    interface JoinClause<TKey1, TKey2> {
      on(raw: Raw): JoinClause<TKey1, TKey2>;
      on(callback: JoinCallback<TKey1, TKey2>): JoinClause<TKey1, TKey2>;
      on(columns: { [key: string]: string | Raw }): JoinClause<TKey1, TKey2>;
      on(column1: TKey1, column2: TKey2): JoinClause<TKey1, TKey2>;
      on(column1: TKey1, raw: Raw): JoinClause<TKey1, TKey2>;
      on(column1: TKey1, operator: string, column2: TKey2 | Raw): JoinClause<TKey1, TKey2>;
      andOn(raw: Raw): JoinClause<TKey1, TKey2>;
      andOn(callback: JoinCallback<TKey1, TKey2>): JoinClause<TKey1, TKey2>;
      andOn(columns: { [key: string]: string | Raw }): JoinClause<TKey1, TKey2>;
      andOn(column1: TKey1, column2: TKey2): JoinClause<TKey1, TKey2>;
      andOn(column1: TKey1, raw: Raw): JoinClause<TKey1, TKey2>;
      andOn(column1: TKey1, operator: string, column2: TKey2 | Raw): JoinClause<TKey1, TKey2>;
      orOn(raw: Raw): JoinClause<TKey1, TKey2>;
      orOn(callback: JoinCallback<TKey1, TKey2>): JoinClause<TKey1, TKey2>;
      orOn(columns: { [key: string]: string | Raw }): JoinClause<TKey1, TKey2>;
      orOn(column1: TKey1, column2: TKey2): JoinClause<TKey1, TKey2>;
      orOn(column1: TKey1, raw: Raw): JoinClause<TKey1, TKey2>;
      orOn(column1: TKey1, operator: string, column2: TKey2 | Raw): JoinClause<TKey1, TKey2>;
      onVal(column1: TKey1, value: Value): JoinClause<TKey1, TKey2>;
      onVal(column1: TKey1, operator: string, value: Value): JoinClause<TKey1, TKey2>;
      andOnVal(column1: TKey1, value: Value): JoinClause<TKey1, TKey2>;
      andOnVal(column1: TKey1, operator: string, value: Value): JoinClause<TKey1, TKey2>;
      orOnVal(column1: TKey1, value: Value): JoinClause<TKey1, TKey2>;
      orOnVal(column1: TKey1, operator: string, value: Value): JoinClause<TKey1, TKey2>;
      onIn(column1: TKey1, values: readonly any[] | Raw): JoinClause<TKey1, TKey2>;
      andOnIn(column1: TKey1, values: readonly any[] | Raw): JoinClause<TKey1, TKey2>;
      orOnIn(column1: TKey1, values: readonly any[] | Raw): JoinClause<TKey1, TKey2>;
      onNotIn(column1: TKey1, values: readonly any[] | Raw): JoinClause<TKey1, TKey2>;
      andOnNotIn(column1: TKey1, values: readonly any[] | Raw): JoinClause<TKey1, TKey2>;
      orOnNotIn(column1: TKey1, values: readonly any[] | Raw): JoinClause<TKey1, TKey2>;
      onNull(column1: TKey1): JoinClause<TKey1, TKey2>;
      andOnNull(column1: TKey1): JoinClause<TKey1, TKey2>;
      orOnNull(column1: TKey1): JoinClause<TKey1, TKey2>;
      onNotNull(column1: TKey1): JoinClause<TKey1, TKey2>;
      andOnNotNull(column1: TKey1): JoinClause<TKey1, TKey2>;
      orOnNotNull(column1: TKey1): JoinClause<TKey1, TKey2>;
      onExists(callback: QueryCallback): JoinClause<TKey1, TKey2>;
      andOnExists(callback: QueryCallback): JoinClause<TKey1, TKey2>;
      orOnExists(callback: QueryCallback): JoinClause<TKey1, TKey2>;
      onNotExists(callback: QueryCallback): JoinClause<TKey1, TKey2>;
      andOnNotExists(callback: QueryCallback): JoinClause<TKey1, TKey2>;
      orOnNotExists(callback: QueryCallback): JoinClause<TKey1, TKey2>;
      onBetween(column1: TKey1, range: readonly [any, any]): JoinClause<TKey1, TKey2>;
      andOnBetween(column1: TKey1, range: readonly [any, any]): JoinClause<TKey1, TKey2>;
      orOnBetween(column1: TKey1, range: readonly [any, any]): JoinClause<TKey1, TKey2>;
      onNotBetween(column1: TKey1, range: readonly [any, any]): JoinClause<TKey1, TKey2>;
      andOnNotBetween(column1: TKey1, range: readonly [any, any]): JoinClause<TKey1, TKey2>;
      orOnNotBetween(column1: TKey1, range: readonly [any, any]): JoinClause<TKey1, TKey2>;
      onJsonPathEquals(
        columnFirst: string,
        jsonPathFirst: string,
        columnSecond: string,
        jsonPathSecond: string
      ): JoinClause<TKey1, TKey2>;
      orOnJsonPathEquals(
        columnFirst: string,
        jsonPathFirst: string,
        columnSecond: string,
        jsonPathSecond: string
      ): JoinClause<TKey1, TKey2>;
      using(column: string | readonly string[] | Raw | { [key: string]: string | Raw }): JoinClause<TKey1, TKey2>;
      type(type: string): JoinClause<TKey1, TKey2>;
    }
  }
}
