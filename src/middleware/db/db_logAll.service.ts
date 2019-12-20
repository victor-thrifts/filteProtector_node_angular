const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { Acclog } from '../../app/_models/acclog';
import { LogAll } from '../../app/_models/logAll';
import { db } from '.';

async function getAll(startid, count,FileName,UserName,AccessType) {
    let logAlls: LogAll[];
    return new Promise(function(resovle,reject){
        try{
            let sql = 'SELECT rowid, * FROM logAll  WHERE 1=1 ';
            // if(FileName){
            //     FileName = '%' + FileName + '%'
            //     sql += "AND FileName LIKE '" + FileName + "' "
            // }
            // if(UserName){
            //     sql += "AND UserName='"+ UserName +  "' "
            // }
            // if(AccessType){
            //     sql += "AND AccessType='" + AccessType + "' "
            // }
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

async function getCountByQuery (FileName,UserName,AccessType) {
    var count : number;
    return new Promise(function(resolve,reject){
        try{
            let sql = 'SELECT count(*) AS count FROM logAll WHERE 1=1 ';
            if(FileName){
                FileName = '%' + FileName + '%'
                sql += "AND FileName LIKE '" + FileName + "' "
            }
            if(UserName){
                sql += "AND UserName='"+ UserName +  "' "
            }
            if(AccessType){
                sql += "AND AccessType='" + AccessType + "' "
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
            const stmt = db.prepare('SELECT rowid, * FROM backupFileAccessLog WHERE rowid=?');
            return resolve(stmt.get(id));
        } catch (err) {
            return reject(err);
        }
    })
}

async function getByName(name)
{
    const stmt = db.prepare('SELECT rowid, * FROM backupFileAccessLog WHERE FileName like %?%');
    return await stmt.get(name);
}

async function saveAll(acclogs: Acclog[])
{
    const insert = db.prepare(
        'INSERT INTO backupFileAccessLog(FileName, AccessType, AccessTime, Author)' +
        'VALUES(@FileName, @AccessType, @AccessTime, @Author)');
    const insertMany = function (acclogs)
    {
        db.prepare("BEGIN TRANSACTION").run();
        for (const log of acclogs) insert.run(log);
        db.prepare("COMMIT TRANSACTION").run();
    }
    await insertMany(acclogs);
}

function save(acclogParam)
{
    const insert = db.prepare(
        'INSERT INTO backupFileAccessLog(FileName, AccessType, AccessTime, Author, UserName)  VALUES(@FileName, @AccessType, @AccessTime, @Author, @UserName)');
    insert.run(acclogParam);

}

export { getById, getAll, getByCount, getByName, save ,getCountByQuery }
