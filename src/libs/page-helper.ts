import { PageQuery, PageResult } from '@/apis/api-client';
import { pageSize } from '@/configs/global';

export interface PageHelper extends PageQuery {
  totalPage: number;
  totalData: number;
}

export function emptyPageHelper(pg?: PageHelper): PageHelper {
  return pg ? pg : { page: 1, size: pageSize, totalPage: 0, totalData: 0 };
}

export function clonePageQuery(pg: PageQuery, page?: number, size?: number): PageQuery {
  const result = { page: pg.page, size: pg.size, sort: pg.sort };
  if (page) result.page = page;
  if (size) result.size = size;
  return result;
}

export function copyHelperResult(pg: PageHelper, result: PageResult<unknown>): void {
  pg.totalData = result.totalData;
  pg.totalPage = result.totalPage;
  pg.page = result.page;
}

export function firstNumber(pg?: PageQuery): number {
  return pg ? pg.size * (pg.page - 1) + 1 : 1;
}
