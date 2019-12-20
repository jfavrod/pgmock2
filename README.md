pgmock2
=======

[![Build Status](https://travis-ci.com/jfavrod/pgmock2.svg?branch=master)](https://travis-ci.com/jfavrod/pgmock2)
![Bundle Size](https://img.shields.io/bundlephobia/min/pgmock2.svg)
[![Requirements Status](https://requires.io/github/jfavrod/pgmock2/requirements.svg?tag=v1.0.1)](https://requires.io/github/jfavrod/pgmock2/requirements/?tag=v1.0.1)


An NPM module for mocking a connection to a PostgreSQL database.

The module mocks a [pg](https://www.npmjs.com/package/pg) module
connection to a PostgreSQL database. Both the `pg.Client` and `pg.Pool`
classes have a `query` method, therefore the mock connection can be
used to simulate an instance of either class.

Installation
------------
Installation via `npm`.
```
npm i --dev-save pgmock2
```

Usage
-----
The idea is to simulate a connection to a database. To enable that
simulation, we need to first `add` data.

### Adding Queries and their Responses
```javascript
// Simple type checking validation.
const pgmock = require('pgmock2');
const pg = new pgmock();

pg.add('SELECT * FROM employees WHERE id = $1', ['number'], {
    rowCount: 1,
    rows: [
        { id: 1, name: 'John Smith', position: 'application developer' }
    ]
});
```

#### Parameters of the add Method
##### Query
The first parameter of the `add` method is the query we add to the mock DB.

Later, we can use a mock connection to retrieve a response to this query.
Internally, the query is normalized (disregards whitespace and is made
case insensitive).

##### Values Validation
The second parameter is an array used to validate any values passed
with the query. In the example above, the `$1` requires a value. In the
validation array, we pass the string `number`.

Since the validation criterion is a string, the only valid values that
can be used at query time must be `typeof` "`number`". Functions can
also be used to validate values (described later).

If a query does not require values, simply pass an empty array.

```javascript
// Quering without passing values.
const
pgmock = require('pgmock2'),
pg = new pgmock();

pg.add('SELECT * FROM employees', [], {
    rowCount: 10,
    rows: [
        { id: 1, name: 'John Smith', position: 'application developer' }
        // ... more employees omitted ...
    ]
});
```

##### Query Response
The thrid parameter is the response returned if the values supplied to
to the `query` method were determined to be valid.

The response MUST have the same interface as a `pg.QueryResponse`.

### Quering the Mock DB
Now we can create a mock connection and query for data.

```javascript
// Get a mock db connection.
const conn = pg.connect();

// Query the mock connection.
conn.query('select * from employees where id=$1;', [1])
.then(data => console.log(data))
.catch(err => console.log(err.message));
```

Since the query is valid and the values passed are correct in number
and type, we should see the expected output.

```
{ rowCount: 1,
  rows:
   [ { id: 1, name: 'John Smith', position: 'application developer' } ] }
```

### Using Functions for Validation
For more advanced query value validation (beyond just simple type
validation) we can use functions.

Let's say that our employee IDs must be whole numbers greater than 0.
We can use a validation function like this:

```javascript
// Advanced validation with functions.
const pgmock = require('pgmock2');
const pg = new pgmock();

const validateId = (id) => {
    return (
        typeof(id) === 'number'
        && isFinite(id)
        && id > 0
        && id === Number(id.toFixed(0)
    );
}

pg.add('SELECT * FROM employees WHERE id = $1', [validateId], {
    rowCount: 1,
    rows: [
        { id: 1, name: 'John Smith', position: 'application developer' }
    ]
});
```

Tests
-----
Tests are found in the `test` directory. To execute them, run:

```
npm run test
```

Documentation
-------------
Live documentation: [here](https://jfavrod.github.io/pgmock2)

To (re)generate documentation: `npm run docs`
