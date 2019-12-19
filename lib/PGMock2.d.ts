/**
 * An NPM module for mocking a connection to a PostgreSQL database.
 * @author Jason Favrod <mail@jasonfavrod.com>
 * @example
 * ```
 * const PGMock2 = require('pgmock2'),
 * const pgmock = new PGMock2();
 * ```
 */
export default class PGMock2 {
    private data;
    private latency;
    setLatency(latency: number): void;
    /**
     * Add a query, it's value definitions, and response to the
     * mock database.
     * @param {string} query An SQL query statement.
     * @param {array} valueDefs Contains the types of each value used
     * in the query.
     * @param {object} response The simulated expected response of
     * the given query.
     * @example
     * ```
     * pgmock.add("SELECT * FROM employees WHERE id = $1", ['number'], {
     *     rowCount: 1,
     *     rows: [
     *         { id: 0, name: 'John Smith', position: 'application developer' }
     *     ]
     * });
     * ```
     */
    add(query: string, valueDefs: any[], response: object): void;
    /**
     * Get a simulated pg.Client or pg.Pool connection.
     * @namespace connect
     * @returns {object}
     * @example const conn = pgmock.connect();
     */
    connect(): object;
    /**
     * Remove a query from the mock database.
     * @param {string} query An SQL statement added with the add method.
     * @returns {boolean} true if removal successful, false otherwise.
     */
    drop(query: string): boolean;
    /**
     * Flushes the mock database.
     */
    dropAll(): void;
    private normalize;
    /**
     * Return a string representation of the mock database.
     * @example
     * ```
     * {
     *     "3141ffa79e40392187830c52d0588f33": {
     *         "query": "SELECT * FROM tpd_hawaii_it.projects",
     *         "valDefs": [],
     *         "response": {
     *             "rowCount": 3,
     *             "rows": [
     *                 {
     *                     "title": "Test Project 0",
     *                     "status": "pending",
     *                     "priority": "low",
     *                     "owner": "Favrod, Jason"
     *                 },
     *                 {
     *                     "title": "Test Project 1",
     *                     "status": "pending",
     *                     "priority": "low",
     *                     "owner": "Favrod, Jason"
     *                 },
     *             ]
     *         }
     *     },
     *     "81c4b35dfd07db7dff2cb0e91228e833": {
     *         "query": "SELECT * FROM tpd_hawaii_it.projects WHERE title = $1",
     *         "valDefs": ["string"],
     *         "response": {
     *             "rowCount": 1,
     *             "rows": [
     *                 {
     *                     "title": "Test Project 0",
     *                     "status": "pending",
     *                     "priority": "low",
     *                     "owner": "Favrod, Jason"
     *                 }
     *             ]
     *         }
     *     }
     * }
     * ```
     */
    toString(): string;
    private validVals;
}
