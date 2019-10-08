var express = require('express');
var router = express.Router();
/*var mysql = require('mysql')
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'jjc958978',
    database : 'mytest'
});

connection.connect()*/
/*router.get('/', function(req, res, next) {

    connection.query('SELECT * FROM employee ORDER BY salary DESC;', function (err, rows, fields) {
        if (err) throw err;
        res.json(
            rows
        )
    })
    connection.end();

});*/

var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : 'jjc958978',
    database : 'mytest'
});

router.get('/', function(req, res, next) {
    pool.query('SELECT * FROM counter;', function (err, rows, fields) {
        if (err) throw err;
        console.log(rows)
        res.json(
            rows
        )

    })
});
router.get('/list', function(req, res, next) {
    pool.query('SELECT * FROM counter;', function (err, rows, fields) {
        if (err) throw err;
        console.log(rows)
        res.json(
            rows
        )

    })
});
router.post('/add', function(req, res, next) {
    console.log(req.body)
    //var mysqltl='INSERT INTO counter(id,counter, time) VALUES(\''+req.body.counter+'\','+'now()'+');'
    var mysqltl=`INSERT INTO counter(counter, time) VALUES('${req.body.counter}',now());`
    console.log(mysqltl)
    pool.query(mysqltl, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows)
        res.json(
            rows
        )

    })
});
router.post('/del', function(req, res, next) {
    var mysqltl=`delete from counter where id = ${req.body.id}`
    console.log(mysqltl)
    pool.query(mysqltl, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows)
        res.json(
            rows
        )

    })
});



module.exports = router;
