const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { LogAll } from '../../app/_models/logAll';
import { db } from '.';

async function getAll(startid, count,Ip,Module,UserName) {
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


function save(acclogParam) {
    const insert = db.prepare(
        'INSERT INTO logAll(UserName,Ip,LogDate,Module,Operand,Type,Describe,Details,Action,Remark)   VALUES(@UserName, @Ip, @LogDate, @Module, @Operand, @Type, @Describe, @Details, @Action, @Remark)');
    insert.run(acclogParam);

}

export { getById, getAll, getByCount, save ,getCountByQuery }
