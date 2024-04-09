declare module 'knex' {
  /* ******************************************************************************************************************/

  /* ******************************************************************************************************************/

  export type SafePartial<T> = Partial<AnyOrUnknownToOther<T, {}>>;

  export type MaybeArray<T> = T | T[];

  export type StrKey<T> = string & keyof T;

  // If T is unknown then convert to any, else retain original
  export type UnknownToAny<T> = unknown extends T ? any : T;
  export type CurlyCurlyToAny<T> = T extends unknown // distribute
    ? (<U>() => U extends T ? 0 : 1) extends <U>() => U extends {} ? 0 : 1
      ? any
      : T
    : never;
  export type UnknownOrCurlyCurlyToAny<T> = [UnknownToAny<T> | CurlyCurlyToAny<T>][0];
  export type AnyToUnknown<T> = unknown extends T ? unknown : T;
  export type AnyOrUnknownToOther<T1, T2> = unknown extends T1 ? T2 : T1;

  // Intersection conditionally applied only when TParams is non-empty
  // This is primarily to keep the signatures more intuitive.
  export type AugmentParams<TTarget, TParams> = TParams extends {}
    ? keyof TParams extends never
      ? TTarget
      : {} & TTarget & TParams
    : TTarget;

  // Check if provided keys (expressed as a single or union type) are members of TBase
  export type AreKeysOf<TBase, TKeys> = Boxed<TKeys> extends Boxed<keyof TBase> ? true : false;

  // https://stackoverflow.com/a/50375286/476712
  export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;

  export type ComparisonOperator = '=' | '>' | '>=' | '<' | '<=' | '<>';

  // If T is an array, get the type of member, else fall back to never
  export type ArrayMember<T> = T extends (infer M)[] ? M : never;

  // If T is an array, get the type of member, else retain original
  export type UnwrapArrayMember<T> = T extends (infer M)[] ? M : T;

  // Wrap a type in a container, making it an object type.
  // This is primarily useful in circumventing special handling of union/intersection in typescript
  export interface Boxed<T> {
    _value: T;
  }

  // If T can't be assigned to TBase fallback to an alternate type TAlt
  export type IncompatibleToAlt<T, TBase, TAlt> = T extends TBase ? T : TAlt;

  export type ArrayIfAlready<T1, T2> = AnyToUnknown<T1> extends any[] ? T2[] : T2;

  // Boxing is necessary to prevent distribution of conditional types:
  // https://lorefnon.tech/2019/05/02/using-boxing-to-prevent-distribution-of-conditional-types/
  export type PartialOrAny<TBase, TKeys> =
    Boxed<TKeys> extends Boxed<never>
      ? {}
      : Boxed<TKeys> extends Boxed<keyof TBase>
        ? SafePick<TBase, TKeys & keyof TBase>
        : any;

  // Retain the association of original keys with aliased keys at type level
  // to facilitates type-safe aliasing for object syntax
  export type MappedAliasType<TBase, TAliasMapping> = {} & {
    [K in keyof TAliasMapping]: TAliasMapping[K] extends keyof TBase ? TBase[TAliasMapping[K]] : any;
  };

  // Container type for situations when we want a partial/intersection eventually
  // but the keys being selected or additional properties being augmented are not
  // all known at once and we would want to effectively build up a partial/intersection
  // over multiple steps.
  export type DeferredKeySelection<
    // The base of selection. In intermediate stages this may be unknown.
    // If it remains unknown at the point of resolution, the selection will fall back to any
    TBase,
    // Union of keys to be selected
    // In intermediate stages this may be never.
    TKeys extends string,
    // Changes how the resolution should behave if TKeys is never.
    // If true, then we assume that some keys were selected, and if TKeys is never, we will fall back to any.
    // If false, and TKeys is never, then we select TBase in its entirety
    THasSelect extends true | false = false,
    // Mapping of aliases <key in result> -> <key in TBase>
    TAliasMapping extends {} = {},
    // If enabled, then instead of extracting a partial, during resolution
    // we will pick just a single property.
    TSingle extends boolean = false,
    // Extra props which will be intersected with the result
    TIntersectProps extends {} = {},
    // Extra props which will be unioned with the result
    TUnionProps = never,
  > = {
    // These properties are not actually used, but exist simply because
    // typescript doesn't end up happy when type parameters are unused
    _base: TBase;
    _hasSelection: THasSelect;
    _keys: TKeys;
    _aliases: TAliasMapping;
    _single: TSingle;
    _intersectProps: TIntersectProps;
    _unionProps: TUnionProps;
  };

  // An companion namespace for DeferredKeySelection which provides type operators
  // to build up participants of intersection/partial over multiple invocations
  // and for final resolution.
  //
  // While the comments use wordings such as replacement and addition, it is important
  // to keep in mind that types are always immutable and all type operators return new altered types.
  export namespace DeferredKeySelection {
    type Any = DeferredKeySelection<any, any, any, any, any, any, any>;

    // Replace the Base if already a deferred selection.
    // If not, create a new deferred selection with specified base.
    type SetBase<TSelection, TBase> =
      TSelection extends DeferredKeySelection<
        any,
        infer TKeys,
        infer THasSelect,
        infer TAliasMapping,
        infer TSingle,
        infer TIntersectProps,
        infer TUnionProps
      >
        ? DeferredKeySelection<TBase, TKeys, THasSelect, TAliasMapping, TSingle, TIntersectProps, TUnionProps>
        : DeferredKeySelection<TBase, never>;

    // If TSelection is already a deferred selection, then replace the base with TBase
    // If unknown, create a new deferred selection with TBase as the base
    // Else, retain original
    //
    // For practical reasons applicable to current context, we always return arrays of
    // deferred selections. So, this particular operator may not be useful in generic contexts.
    type ReplaceBase<TSelection, TBase> =
      UnwrapArrayMember<TSelection> extends DeferredKeySelection.Any
        ? ArrayIfAlready<TSelection, DeferredKeySelection.SetBase<UnwrapArrayMember<TSelection>, TBase>>
        : unknown extends UnwrapArrayMember<TSelection>
          ? ArrayIfAlready<TSelection, DeferredKeySelection.SetBase<unknown, TBase>>
          : TSelection;

    // Type operators to substitute individual type parameters:

    type SetSingle<TSelection, TSingle extends boolean> =
      TSelection extends DeferredKeySelection<
        infer TBase,
        infer TKeys,
        infer THasSelect,
        infer TAliasMapping,
        any,
        infer TIntersectProps,
        infer TUnionProps
      >
        ? DeferredKeySelection<TBase, TKeys, THasSelect, TAliasMapping, TSingle, TIntersectProps, TUnionProps>
        : never;

    type AddKey<TSelection, TKey extends string> =
      TSelection extends DeferredKeySelection<
        infer TBase,
        infer TKeys,
        any,
        infer TAliasMapping,
        infer TSingle,
        infer TIntersectProps,
        infer TUnionProps
      >
        ? DeferredKeySelection<TBase, TKeys | TKey, true, TAliasMapping, TSingle, TIntersectProps, TUnionProps>
        : DeferredKeySelection<unknown, TKey, true>;

    type AddAliases<TSelection, T extends {}> =
      TSelection extends DeferredKeySelection<
        infer TBase,
        infer TKeys,
        infer THasSelect,
        infer TAliasMapping,
        infer TSingle,
        infer TIntersectProps,
        infer TUnionProps
      >
        ? DeferredKeySelection<TBase, TKeys, THasSelect, TAliasMapping & T, TSingle, TIntersectProps, TUnionProps>
        : DeferredKeySelection<unknown, never, false, T>;

    type AddUnionMember<TSelection, T> =
      TSelection extends DeferredKeySelection<
        infer TBase,
        infer TKeys,
        infer THasSelect,
        infer TAliasMapping,
        infer TSingle,
        infer TIntersectProps,
        infer TUnionProps
      >
        ? DeferredKeySelection<TBase, TKeys, THasSelect, TAliasMapping, TSingle, TIntersectProps, TUnionProps | T>
        : DeferredKeySelection<TSelection, never, false, {}, false, {}, T>;

    // Convenience utility to set base, keys and aliases in a single type
    // application
    type Augment<T, TBase, TKey extends string, TAliasMapping extends {} = {}> = AddAliases<
      AddKey<SetBase<T, TBase>, TKey>,
      TAliasMapping
    >;

    // Core resolution logic -- Refer to docs for DeferredKeySelection for specifics
    type ResolveOne<TSelection> =
      TSelection extends DeferredKeySelection<
        infer TBase,
        infer TKeys,
        infer THasSelect,
        infer TAliasMapping,
        infer TSingle,
        infer TIntersectProps,
        infer TUnionProps
      >
        ? UnknownOrCurlyCurlyToAny<
            // ^ We convert final result to any if it is unknown for backward compatibility.
            //   Historically knex typings have been liberal with returning any and changing
            //   default return type to unknown would be a major breaking change for users.
            //
            //   So we compromise on type safety here and return any.
            | AugmentParams<
                AnyToUnknown<TBase> extends {}
                  ? // ^ Conversion of any -> unknown is needed here to prevent distribution
                    //   of any over the conditional
                    TSingle extends true
                    ? TKeys extends keyof TBase
                      ? TBase[TKeys]
                      : any
                    : AugmentParams<
                        true extends THasSelect ? PartialOrAny<TBase, TKeys> : TBase,
                        MappedAliasType<TBase, TAliasMapping>
                      >
                  : unknown,
                TIntersectProps
              >
            | TUnionProps
          >
        : TSelection;

    type Resolve<TSelection> = TSelection extends DeferredKeySelection.Any
      ? Knex.ResolveTableType<ResolveOne<TSelection>>
      : TSelection extends DeferredKeySelection.Any[]
        ? Knex.ResolveTableType<ResolveOne<TSelection[0]>>[]
        : TSelection extends (infer I)[]
          ? UnknownOrCurlyCurlyToAny<Knex.ResolveTableType<I>>[]
          : UnknownOrCurlyCurlyToAny<Knex.ResolveTableType<TSelection>>;
  }

  export type AggregationQueryResult<TResult, TIntersectProps2 extends {}> = ArrayIfAlready<
    TResult,
    UnwrapArrayMember<TResult> extends DeferredKeySelection<
      infer TBase,
      infer TKeys,
      infer THasSelect,
      infer TAliasMapping,
      infer TSingle,
      infer TIntersectProps,
      infer TUnionProps
    >
      ? true extends THasSelect
        ? DeferredKeySelection<
            TBase,
            TKeys,
            THasSelect,
            TAliasMapping,
            TSingle,
            TIntersectProps & TIntersectProps2,
            TUnionProps
          >
        : DeferredKeySelection<{}, never, true, {}, false, TIntersectProps2>
      : TIntersectProps2
  >;

  // If we have more categories of deferred selection in future,
  // this will combine all of them
  export type ResolveResult<S> = DeferredKeySelection.Resolve<S>;

  // # Type-aliases for common type combinations

  export type Callback = Function;
  export type Client = Function;

  export type Dict<T = any> = { [k: string]: T };

  export type SafePick<T, K extends keyof T> = T extends {} ? Pick<T, K> : any;

  export type TableOptions = PgTableOptions;

  export interface PgTableOptions {
    only?: boolean;
  }

  export interface DMLOptions {
    includeTriggerModifications?: boolean;
  }
}
