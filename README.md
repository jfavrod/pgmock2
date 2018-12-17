pgmock2
=======

![Package Version](https://img.shields.io/github/package-json/v/jfavrod/pgmock2.svg)
![Bundle Size](https://img.shields.io/bundlephobia/min/pgmock2.svg)
[![Build Status](https://api.travis-ci.org/jfavrod/pgmock2.svg?branch=master)](https://travis-ci.org/jfavrod/pgmock2)
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

Use
---
The idea is to simulate a connection to a database. To enable that
simulation, we need to first `add` data.

```javascript
const
pgmock = require('pgmock2'),
pgMock = pgmock();

pgMock.add('SELECT * FROM employees WHERE id = $1', ['number'], {
    rowCount: 1,
    rows: [
        { id: 0, name: 'John Smith', position: 'application developer' }
    ]
});
```

Now we can create a mock connection and query for this data.

```javascript
const conn = pgMock.connect();

conn.query('select * from employees where id=$1;', [0])
.then(data => console.log(data))
.catch(err => console.log(err.message));
```

Since the query is valid and the values passed are correct in number
and type, we should see the expected output.

```
{ rowCount: 1,
  rows:
   [ { id: 0, name: 'John Smith', position: 'application developer' } ] }
```
