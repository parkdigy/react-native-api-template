import { knex } from 'knex';

export interface Paging {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginateOption {
  page: number;
  limit: number;
}

export interface PaginateResult<TData> {
  data: TData;
  paging: Paging;
}

declare module 'knex' {
  namespace Knex {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface QueryBuilder<TRecord extends {} = any, TResult = any> {
      paginate(page: number, limit: number): Promise<PaginateResult<ResolveResult<TResult>>>;
    }
  }
}

knex.QueryBuilder.extend('paginate', async function (page = 1, limit = 10): Promise<any> {
  if (isNaN(page)) {
    throw new Error('Paginate error: page must be a number.');
  }

  if (isNaN(limit)) {
    throw new Error('Paginate error: limit must be a number.');
  }

  if (page < 1) page = 1;

  const offset = (page - 1) * limit;

  const postProcessResponse =
    typeof this.client.config.postProcessResponse === 'function'
      ? this.client.config.postProcessResponse
      : function (key: string) {
          return key;
        };

  this.offset(offset).limit(limit);

  const result = await this;

  const countResult = await this.clone()
    .clearSelect()
    .clearOrder()
    .clearGroup()
    .clearCounters()
    .offset(0)
    .count('* as total')
    .first();

  const total = +(countResult.TOTAL || countResult.total);

  let paging: Paging = {
    current_page: page,
    per_page: limit,
    last_page: Math.ceil(total / limit),
    total,
    from: offset,
    to: offset + result.length,
  };

  paging = postProcessResponse(paging, this.queryContext());

  return { data: result, paging };
});
