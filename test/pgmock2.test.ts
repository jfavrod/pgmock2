import assert from 'assert';
import 'mocha';
import { Pool, QueryResult } from 'pg';

import { IPGClient } from '../src/interfaces';
import { isIPGClient } from '../src/typeguards';

import pgmock, { getPool } from '../src';

describe('pgmock2 tests...', () => {
    describe('Test Instance', () => {
        const pg = new pgmock();

        it('Should create a new instance of pgmock2', () => {
            assert.strictEqual(pg instanceof pgmock, true);
        });
    });

    describe('Test `add` Method', () => {
        const pg = new pgmock();
        const len = pg.toString().length;
        const rows = [
            {attrib1: 'val1', attrib2: 'val2'}
        ];

        pg.add('SELECT * FROM schema.table;', [], {
            rowCount: 1,
            rows,
        } as QueryResult);

        it('Should have new data in the mock database.', () => {
            assert.strictEqual(len < pg.toString().length, true);
        });

        it('Should be able to retrieve the data.', async () => {
            const mock = await pg.connect();
            const data = await mock.query('SELECT * FROM schema.table', []);

            assert.strictEqual(data.rowCount, 1, 'Wrong number of rows.');
            assert.strictEqual(JSON.stringify(data.rows), JSON.stringify(rows),
                'Unexpected row data.');
        });
    });

    describe('Test `connect` Method', () => {
        const pg = new pgmock();
        let pgClient: IPGClient;

        it('Should return an IPGClient object.', async () => {
            pgClient = await pg.connect();
            assert.strictEqual(isIPGClient(pgClient), true,
                'Unexpected object: ' + JSON.stringify(pgClient, null, 2)
            );
        });
    });

    describe('Test `drop` Method', () => {
        const pg = new pgmock();
        const sql = 'SELECT * FROM schema.table;';
        const len = pg.toString().length;

        pg.add(sql, [], {
            rowCount: 1,
            rows: [
                {attrib1: 'val1', attrib2: 'val2'}
            ]
        } as QueryResult);

        it('Should add then remove a query.', () => {
            assert.strictEqual(len < pg.toString().length, true,
                'Failed to add query.');

            pg.drop(sql);

            assert.strictEqual(pg.toString().length, len,
                'Failed to drop query.');
        });
    });


    describe('Test `dropAll` Method', () => {
        const pg = new pgmock();
        const sql1 = 'SELECT * FROM schema.table;';
        const sql2 = 'SELECT * FROM schema2.table2;';
        const len = pg.toString().length;

        pg.add(sql1, [], {
            rowCount: 1,
            rows: [
                {attrib1: 'val1', attrib2: 'val1'}
            ]
        } as QueryResult);

        pg.add(sql2, [], {
            rowCount: 1,
            rows: [
                {attrib1: 'val2', attrib2: 'val2'}
            ]
        } as QueryResult);

        it('Should add then remove a queries.', () => {
            assert.strictEqual(len < pg.toString().length, true,
                'Failed to add queries.');

            pg.dropAll();

            assert.strictEqual(pg.toString().length, len,
                'Failed to drop queries.');
        });
    });

    describe('Test `connect.query` Method', () => {
        const pg = new pgmock();
        const query = 'SELECT * FROM schema.table;';

        pg.add(query, [], {
            rowCount: 1,
            rows: [
                {attrib1: 'val1', attrib2: 'val2'}
            ]
        } as QueryResult);

        it('Should have the values of the added item.', async () => {
            const pgClient = await pg.connect();
            const res = await pgClient.query(query, []);
            assert.ok(res.rows);
            assert.ok(res.rows[0]);
            assert.ok('attrib1' in res.rows[0]);
            assert.ok('attrib2' in res.rows[0]);

            if ('attrib1' in res.rows[0]) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                assert.equal(res.rows[0].attrib1, 'val1');
            }
            if ('attrib2' in res.rows[0]) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                assert.equal(res.rows[0].attrib2, 'val2');
            }
        });

        it('Should respond with an error if given wrong values.', async () => {
            const pgClient = await pg.connect();

            try {
                await pgClient.query(query, ['hello']);
            }
            catch (err) {
                assert.match(
                    (err as Error).message,
                    /invalid values/,
                    `Expected invalid values, instead got ${(err as Error).message}`
                );
            }
        });

        it('Should respond with an error if given invalid query.', async () => {
            const pgClient = await pg.connect();

            try {
                await pgClient.query('select * schema.table', []);
            }
            catch (err) {
                assert.match((err as Error).message, /invalid query/);
            }
        });
    });

    describe('Test `pool.query` Method', () => {
        const pg = new pgmock();
        const query = 'SELECT * FROM schema.table;';
        interface TestType { attrib1: string; attrib2: string }

        pg.add(query, [], {
            rowCount: 1,
            rows: [
                {attrib1: 'val1', attrib2: 'val2'}
            ]
        } as QueryResult);

        it('Should have the values of the added item.', async () => {
            const pgPool = getPool(pg);
            const res = await pgPool.query(query, []);
            assert.equal((res.rows as TestType[])[0].attrib1, 'val1');
            assert.equal((res.rows as TestType[])[0].attrib2, 'val2');
        });

        it('Should have the values of the added item with QueryConfig.', async () => {
            const pgPool = getPool(pg);
            const res = await pgPool.query({ text: query });
            assert.equal((res.rows as TestType[])[0].attrib1, 'val1');
            assert.equal((res.rows as TestType[])[0].attrib2, 'val2');
        });

        it('Should respond with an error if given wrong values.', async () => {
            const pgPool = getPool(pg);

            try {
                await pgPool.query(query, ['hello']);
            }
            catch (err) {
                assert.match(
                    (err as Error).message,
                    /invalid values/,
                    `Expected invalid values, instead got ${(err as Error).message}`
                );
            }
        });

        it('Should respond with an error if given wrong values with QueryConfig.', async () => {
            const pgPool = getPool(pg);

            try {
                await pgPool.query({ text: query, values: ['hello'] });
            }
            catch (err) {
                assert.match(
                    (err as Error).message,
                    /invalid values/,
                    `Expected invalid values, instead got ${(err as Error).message}`
                );
            }
        });

        it('Should respond with an error if given invalid query.', async () => {
            const pgPool = getPool(pg);

            try {
                await pgPool.query('select * schema.table', []);
            }
            catch (err) {
                assert.match((err as Error).message, /invalid query/);
            }
        });

        it('Should respond with an error if given invalid query with QueryConfig.', async () => {
            const pgPool = getPool(pg);

            try {
                await pgPool.query({ text: 'select * schema.table' });
            }
            catch (err) {
                assert.match((err as Error).message, /invalid query/);
            }
        });
    });

    describe('Test connect.query with function validation and valid input', () => {
        interface TestType { id: number; name: string; position: string}
        const pg = new pgmock();

        const validId = (id: number | string) => (
            id > 0 && id === Number(parseInt(id as string))
        );

        pg.add('SELECT * FROM employees WHERE id = $1', [validId], {
            rowCount: 1,
            rows: [
                { id: 1, name: 'John Smith', position: 'application developer' }
            ]
        } as QueryResult);

        it('Should return a valid response', async () => {
            const client = await pg.connect();
            const res = await client.query('SELECT * FROM employees WHERE id = $1', [1]);
            assert.strictEqual(res.rowCount, 1);
            assert.strictEqual((res.rows as TestType[])[0].id, 1);
            assert.strictEqual((res.rows as TestType[])[0].name, 'John Smith');
        });
    });

    describe('Test pool.query with function validation and valid input', () => {
        interface TestType { id: number; name: string; position: string}
        const pg = new pgmock();
        const query = 'SELECT * FROM employees WHERE id = $1';

        const validId = (id: number | string) => (
            id > 0 && id === Number(parseInt(id as string))
        );

        pg.add(query, [validId], {
            rowCount: 1,
            rows: [
                { id: 1, name: 'John Smith', position: 'application developer' }
            ]
        } as QueryResult);

        it('Should return a valid response', async () => {
            const pgPool = getPool(pg);
            const res = await pgPool.query(query, [1]);
            assert.strictEqual(res.rowCount, 1);
            assert.strictEqual((res.rows as TestType[])[0].id, 1);
            assert.strictEqual((res.rows as TestType[])[0].name, 'John Smith');
        });

        it('Should return a valid response with QueryConfig', async () => {
            const pgPool = getPool(pg);
            const res = await pgPool.query({ text: query, values: [1] });
            assert.strictEqual(res.rowCount, 1);
            assert.strictEqual((res.rows as TestType[])[0].id, 1);
            assert.strictEqual((res.rows as TestType[])[0].name, 'John Smith');
        });
    });

    describe('Test connect.query with function validation and invalid input', () => {
        const pg = new pgmock();

        const validId = (id: any) => (
            typeof(id) === 'number' && isFinite(id) && id > 0 && id === Number(id.toFixed(0))
        );

        pg.add('SELECT * FROM employees WHERE id = $1', [validId], {
            rowCount: 1,
            rows: [
                { id: 1, name: 'John Smith', position: 'application developer' }
            ]
        } as QueryResult);

        it('Should reject if value is a string.', async () => {
            const client = await pg.connect();

            const badValues = async () => {
                await client.query('SELECT * FROM employees WHERE id = $1', ['1']);
            };

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            assert.rejects(badValues);
        });

        it('Should reject if value is 0 or less.', async () => {
            const client = await pg.connect();

            const badValues = async () => {
                await client.query('SELECT * FROM employees WHERE id = $1', [0]);
            };

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            assert.rejects(badValues);
        });

        it('Should reject if value is a float.', async () => {
            const client = await pg.connect();

            const badValues = async () => {
                await client.query('SELECT * FROM employees WHERE id = $1', [1.1]);
            };

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            assert.rejects(badValues);
        });
    });

    describe("Test connect.query with QueryConfig", () => {
        interface TestType { id: number; name: string; position: string}
        const pg = new pgmock();

        const validId = (id: number | string) => (
            id > 0 && id === Number(parseInt(id as string))
        );

        pg.add("SELECT * FROM employees WHERE id = $1", [validId], {
            rowCount: 1,
            rows: [
                { id: 1, name: "John Smith", position: "application developer" },
            ],
        } as QueryResult);

        it("Should return a valid response", async () => {
            const client = await pg.connect();
            const res = await client.query(
                {
                    text: "SELECT * FROM employees WHERE id = $1",
                    values: [1]
                }
            );
            assert.strictEqual(res.rowCount, 1);
            assert.strictEqual((res.rows as TestType[])[0].id, 1);
            assert.strictEqual((res.rows as TestType[])[0].name, "John Smith");
        });

        it("Should return a valid response", async () => {
            const client = await pg.connect();
            const res = await client.query({
                text: "SELECT * FROM employees WHERE id = $1",
            }, [1]);
            assert.strictEqual(res.rowCount, 1);
            assert.strictEqual((res.rows as TestType[])[0].id, 1);
            assert.strictEqual((res.rows as TestType[])[0].name, "John Smith");
        });
    });

    describe('Test pool.query with function validation and invalid input', () => {
        const pg = new pgmock();
        const query = 'SELECT * FROM employees WHERE id = $1';

        const validId = (id: any) => (
            typeof(id) === 'number' && isFinite(id) && id > 0 && id === Number(id.toFixed(0))
        );

        pg.add(query, [validId], {
            rowCount: 1,
            rows: [
                { id: 1, name: 'John Smith', position: 'application developer' }
            ]
        } as QueryResult);

        it('Should reject if value is a string.', () => {
            const pool = getPool(pg);

            const badValues = (async () => {
                await pool.query(query, ['1']);
            });

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            assert.rejects(badValues);
        });

        it('Should reject if value is 0 or less.', () => {
            const pool = getPool(pg);

            const badValues = async () => {
                await pool.query(query, [0]);
            };

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            assert.rejects(badValues);
        });

        it('Should reject if value is a float.', () => {
            const pool = getPool(pg);

            const badValues = async () => {
                await pool.query(query, [1.1]);
            };

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            assert.rejects(badValues);
        });
    });

    describe("Test pool.query with QueryConfig", () => {
        interface TestType { id: number; name: string; position: string }
        const pg = new pgmock();
        const query = 'SELECT * FROM employees WHERE id = $1';

        const validId = (id: number | string) => (
            id > 0 && id === Number(parseInt(id as string))
        );

        pg.add(query, [validId], {
            rowCount: 1,
            rows: [
                { id: 1, name: "John Smith", position: "application developer" },
            ],
        } as QueryResult);

        it("Should return a valid response", async () => {
            const pool = getPool(pg);
            const res = await pool.query({
                text: "SELECT * FROM employees WHERE id = $1",
                values: [1]
            });
            assert.strictEqual(res.rowCount, 1);
            assert.strictEqual((res.rows as TestType[])[0].id, 1);
            assert.strictEqual((res.rows as TestType[])[0].name, "John Smith");
        });

        it("Should return a valid response", async () => {
            const pool = getPool(pg);
            const res = await pool.query({
                text: "SELECT * FROM employees WHERE id = $1",
            }, [1]);
            assert.strictEqual(res.rowCount, 1);
            assert.strictEqual((res.rows as TestType[])[0].id, 1);
            assert.strictEqual((res.rows as TestType[])[0].name, "John Smith");
        });
    });

    describe('Test using getPool with pgmock2 instance', () => {
        interface TestType { id: number; name: string; position: string }
        const pg = new pgmock();
        const pool = getPool(pg);

        pg.add('SELECT * FROM employees', [], {
            rowCount: 3,
            rows: [
                { id: 1, name: 'John Smith', position: 'application developer' },
                { id: 2, name: 'Jane Smith', position: 'application developer' },
                { id: 3, name: 'Robert Polson', position: 'project manager' }
            ]
        } as QueryResult);

        it('Should satisfy Pool parameter', () => {
            class Tester {
                public testPool: Pool;

                public constructor(testPool: Pool) {
                    this.testPool = testPool;
                }
            }

            assert.strictEqual(new Tester(pool) instanceof Tester, true);
        });

        it('Should work with adding and retrieving queries', async () => {
            const client = await pool.connect();
            const res = await client.query('SELECT * FROM employees');
            const ids = (res.rows as TestType[]).map((row) => row.id);
            const names = (res.rows as TestType[]).map((row) => row.name);

            assert.strictEqual(res.rowCount, 3,
                'Failed to retrieve correct number of rows.');

            assert.ok(ids.includes(1) && ids.includes(2) && ids.includes(3),
                'Failed to retrieve correct ids');

            assert.ok(names.includes('John Smith') && names.includes('Jane Smith') && names.includes('Robert Polson'),
                'Failed to retrieve correct names');
        });
    });

    describe('Test `toString` Method', () => {
        const pg = new pgmock();

        it('Should return a string reprenstation of the data object.', () => {
            const str = pg.toString();
            assert.equal(typeof(str), 'string');
            assert.equal(typeof(JSON.parse(str)), 'object');
        });
    });
});
