type Enum_Type = { [k: string]: string };

type CamelCase<S extends PropertyKey> = S extends string
  ? S extends `${infer T}_${infer U}`
    ? `${Capitalize<Lowercase<T>>}${CamelCase<U>}`
    : Capitalize<Lowercase<S>>
  : S;

export default function makeEnum<
  TName extends string,
  TEnum extends Enum_Type,
  TAlias extends Readonly<{ [K in keyof TEnum]: string }> | undefined = undefined,
  TKeys extends keyof TEnum = keyof TEnum,
  TKeyList extends TKeys[] = TKeys[],
  TNameListItem = {
    [key in TName | 'name']: string | TKeys;
  },
  TNameList extends TNameListItem[] = TNameListItem[],
>(
  name: TName,
  enums: TEnum,
  alias?: TAlias
): (TAlias extends undefined
  ? {
      [K in TKeys as CamelCase<K>]: K;
    }
  : {
      [K in keyof TAlias as TAlias[K] extends string ? TAlias[K] : never]: K;
    }) & {
  getList(copy?: boolean): TKeyList;
  getName(key: TKeys): string | TKeys;
  getNameList(deepCopy?: boolean): TNameList;
} {
  const keyList: TKeyList = Object.keys(enums) as TKeyList;

  function getName(key: TKeys): string | TKeys {
    const name = enums[key];
    return name == null ? key : name;
  }

  const nameList = keyList.map((value) => {
    const item: { [k: string]: string | TKeys } = { name: getName(value) };
    item[name] = value;
    return item as TNameListItem;
  }) as TNameList;

  const result: any = {
    getList(copy = false): TKeyList {
      if (copy) {
        return [...keyList] as TKeyList;
      } else {
        return keyList;
      }
    },
    getName,
    getNameList(deepCopy = false): TNameList {
      if (deepCopy) {
        return nameList.map((item) => ({ ...item })) as TNameList;
      } else {
        return nameList;
      }
    },
  };

  keyList.forEach((key) => {
    const newKey = (key as string).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    if (alias) {
      result[`${alias[key]}`] = key;
    } else {
      result[`${newKey.substring(0, 1).toUpperCase()}${newKey.substring(1)}`] = key;
    }
  });

  return result;
}
