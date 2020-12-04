import { QueryResult, QueryConfig, QueryArrayResult } from 'pg';

export interface IPGClient {
  end: () => Promise<void>
  release: () => Promise<void>
  query(queryText: string, values: any[]): Promise<QueryResult>
  query(queryConfig: QueryConfig): Promise<QueryResult>
  query(queryConfig: QueryConfig, values: any[]): Promise<QueryResult>
}
