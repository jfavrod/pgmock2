const
pgmock = require('../lib/pgmock'),
assert = require('assert');

describe('pgmock tests...', function() {
    describe('Test Instance', function() {
        let pgMock = pgmock();

        it('Should create an instance object.', function() {
            assert.equal(typeof(pgMock), 'object');
        });

        it('Should have an add method.', function() {
            assert.equal(typeof(pgMock.add), 'function');
        });

        it('Should have a connect method.', function() {
            assert.equal(typeof(pgMock.connect), 'function');
        });

        it('Should have a drop method.', function() {
            assert.equal(typeof(pgMock.drop), 'function');
        });

        it('Should have a dropAll method.', function() {
            assert.equal(typeof(pgMock.dropAll), 'function');
        });

        it('Should have a toString method.', function() {
            assert.equal(typeof(pgMock.toString), 'function');
        });
    });


    describe('Test `toString` Method', function() {
        let pgMock = pgmock();

        it('Should return a string reprenstation of the data object.', function() {
            let str = pgMock.toString();
            assert.equal(typeof(str), 'string');
            assert.equal(typeof(JSON.parse(str)), 'object');
        });
    });


    describe('Test `add` Method', function() {
        let pgMock = pgmock();
        let len = pgMock.toString().length;
        
        pgMock.add('SELECT * FROM schema.table;', [], {
            rowCount: 1,
            rows: [
                {attrib1: 'val1', attrib2: 'val2'}
            ]
        });

        it('Should have new data in the mock database.', function() {
            assert.ok(len < pgMock.toString().length);
        });
    });


    describe('Test `connect` Method', function() {
        let pgMock = pgmock();
        let pgClient;

        it('Should return an object.', async function() {
            pgClient = await pgMock.connect();
            assert.equal(typeof(pgClient), 'object');
        });

        it('Should have a query method.', function() {
            assert.equal(typeof(pgClient.query), 'function');
        });

        it('Should have a release method.', function() {
            assert.equal(typeof(pgClient.release), 'function');
        });

        it('Should have an end method.', function() {
            assert.equal(typeof(pgClient.end), 'function');
        });
    });

    describe('Test `connect.query` Method', function() {
        let pgMock = pgmock();
        let pgClient = pgMock.connect();
        let query = 'SELECT * FROM schema.table;';
        
        pgMock.add(query, [], {
            rowCount: 1,
            rows: [
                {attrib1: 'val1', attrib2: 'val2'}
            ]
        });

        it('Should have the values of the added item.', async function() {
            let res = await pgClient.query(query);
            assert.equal(res.rows[0].attrib1, 'val1');
            assert.equal(res.rows[0].attrib2, 'val2');
        });
    })
});
