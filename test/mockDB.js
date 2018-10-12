const
pgmock = require('../lib/pgmock'),
pgMock = pgmock();


pgMock.add("SELECT * FROM tpd_hawaii_it.projects", [], {
    rowCount: 3,
    rows: [
        { title: "Test Project 0", status: "pending", priority: "low", owner: "Favrod, Jason" },
        { title: "Test Project 1", status: "pending", priority: "low", owner: "Favrod, Jason" },
        { title: "Test Project 2", status: "pending", priority: "low", owner: "Favrod, Jason" },
    ]
});

pgMock.add("SELECT * FROM tpd_hawaii_it.projects WHERE title = $1", ['string'], {
    rowCount: 1,
    rows: [
        { title: "Test Project 0", status: "pending", priority: "low", owner: "Favrod, Jason" },
    ]
});



pgMock.query("SELECT * FROM tpd_hawaii_it.projects").then(data => console.log(data))


pgMock.query("SELECT * FROM tpd_hawaii_it.projects WHERE title = $1", ['Test Project 0'])
.then(data => console.log(data))


pgMock.query("ELECT * FROM tpd_hawaii_it.projects WHERE title = $1", [7])
.then(data => console.log(data))
.catch(err => console.log(err.message));

