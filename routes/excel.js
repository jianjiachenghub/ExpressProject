var express = require('express');
var router = express.Router();
const xlsx = require('node-xlsx')
const fs = require('fs')
var multiparty = require('multiparty');

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
router.get('/merge', function(req, res, next) {
    const _file = `./public/file/`
    const _output = `./public/result/`
// 合并数据的结果集
    let dataList = [
        {
            name: '考场分布情况',
            data: []
        },
        {
            name:'学生名单',
            data:[]
        }]

    init()
    function init () {
        fs.readdir(_file, function(err, files) {
            console.log(_file)
            if (err) {
                throw err
            }
            // files是一个数组
            // 每个元素是此目录下的文件或文件夹的名称
            // console.log(`${files}`);
            files.forEach((item, index) => {
                console.log(item)
                try {
                    // console.log(`${_file}${item}`)
                    console.log(`开始合并：${item}`)
                    let excelData = xlsx.parse(`${_file}${item}`)
                    console.log(excelData)
                    if (excelData) {
                        if (dataList[0].data.length > 0&&dataList[1].data.length > 0) {
                            excelData[0].data.splice(0, 1)
                            excelData[1].data.splice(0, 1)
                            //console.log(excelData[1].data)
                        }
                        dataList[0].data = dataList[0].data.concat(excelData[0].data)
                        dataList[1].data = dataList[1].data.concat(excelData[1].data)

                    }
                } catch (e) {
                    console.log(e)
                    console.log('excel表格内部字段不一致，请检查后再合并。')
                }
            })
            // 写xlsx
            var buffer = xlsx.build(dataList)
            fs.writeFile(`${_output}resut.${new Date().getTime()}.xlsx`, buffer, function (err) {
                if (err) {
                    throw err
                }
                console.log('\x1B[33m%s\x1b[0m', `完成合并：${_output}resut.${new Date().getTime()}.xlsx`)
            })
        })
    }
});

router.post('/upload', function(req, res, next) {
    var form = new multiparty.Form({uploadDir: './public/file/'});

    form.parse(req, function(err, fields, files) {
        if(err){
            res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
            res.end("{'status':400, 'message': '上传失败！'}");
        } else {
            res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
            res.end("{'status':200, 'message': '上传成功！'}");
        }
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
