import { QueryConfig, QueryResult } from 'pg';

export interface IPGClient {
    end: () => Promise<void>;
    release: () => Promise<void>;
    query(queryText: string | QueryConfig, values: any[]): Promise<QueryResult>;
    query(queryConfig: QueryConfig): Promise<QueryResult>;
}

export interface MockQueryResult extends Omit<Partial<QueryResult>, 'rows' | 'rowCount'> {
    rows: any[];
    rowCount: number;
}

export interface IPGMockData {
    [index: string]: {
        query: string;
        response: MockQueryResult;
        valDefs: unknown[];
    };
}
