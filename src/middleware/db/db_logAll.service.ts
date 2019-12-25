const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { LogAll } from '../../app/_models/logAll';
import { db } from '.';

async function getAll(startid, count,Ip,Module,UserName,dateArray) {
    let logAlls: LogAll[];
    return new Promise(function(resovle,reject){
        try{
            let sql = 'SELECT rowid, * FROM logAll  WHERE 1=1 ';
            if(Ip){
                Ip = '%' + Ip + '%'
                sql += "AND Ip LIKE '" + Ip + "' "
            }
            if(Module){
                sql += "AND Module='"+ Module +  "' "
            }
            if(UserName){
                sql += "AND UserName='" + UserName + "' "
            }
            if (dateArray.length > 2){
              let parse = JSON.parse(dateArray);
              let start = dateFormat(new Date(parse[0]));
              let end = dateFormat(new Date(parse[1]));
              sql += "AND LogDate BETWEEN '" + start + "' AND '" + end + "' "
            }
            sql += 'ORDER BY rowid DESC LIMIT ? OFFSET ?'
            console.log(sql);
            const stmt = db.prepare(sql);
            return resovle(logAlls = stmt.all(count, startid));
        } catch (err) {
            return reject(err);
        }
    });
}

async function getByCount() {
    var count : number;
    return new Promise(function(resolve,reject){
        try{
            const getCount = db.prepare('SELECT count(*) AS count FROM logAll');
            return resolve(count = getCount.get());
        } catch (err) {
            return reject(err);
        }
    })
}

async function getCountByQuery (Ip,Module,UserName) {
    var count : number;
    return new Promise(function(resolve,reject){
        try{
            let sql = 'SELECT count(*) AS count FROM logAll WHERE 1=1 ';
            if(Ip){
                Ip = '%' + Ip + '%'
                sql += "AND Ip LIKE '" + Ip + "' "
            }
            if(Module){
                sql += "AND Module='"+ Module +  "' "
            }
            if(UserName){
                sql += "AND UserName='" + UserName + "' "
            }
            const getCount = db.prepare(sql);
            return resolve(count = getCount.get());
        } catch (err) {
            return reject(err);
        }
    })

}

async function getById(id) {
    return new Promise(function(resolve,reject){
        try{
            const stmt = db.prepare('SELECT rowid, * FROM logAll WHERE rowid=?');
            return resolve(stmt.get(id));
        } catch (err) {
            return reject(err);
        }
    })
}


async function insertLogAll(logAll) {
    const insert = db.prepare(
        'INSERT INTO logAll(UserName,Ip,LogDate,Module,Operand,Type,Describe,Details,Action,Remark)   VALUES(?,?,?,?,?,?,?,?,?,?)'
    );
    insert.run(logAll.UserName,logAll.Ip,dateFormat(new Date()),logAll.Module,logAll.Operand,logAll.Type,logAll.Describe,logAll.Details,logAll.Action,logAll.Remark);
}

function dateFormat(date) {
    let fmt = "YYYY-mm-dd HH:MM:SS"
    let ret;
    let opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

export { getById, getAll, getByCount, insertLogAll ,getCountByQuery }
