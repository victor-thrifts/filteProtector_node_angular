const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { Acclog } from '../../app/_models/acclog';
import { db } from '.';

async function getAll(startid, count,FileName,UserName,AccessType, dateArray) {
    let accloges: Acclog[];
    return new Promise(function(resovle,reject){
        try{
            let sql = 'SELECT rowid, * FROM backupFileAccessLog  WHERE 1=1 ';
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
            if (dateArray.length > 2){
              let parse = JSON.parse(dateArray);
              let start = dateFormat(new Date(parse[0]));
              let end = dateFormat(new Date(parse[1]));
              sql += "AND AccessTime BETWEEN '" + start + "' AND '" + end + "' "
            }
            sql += 'ORDER BY rowid DESC LIMIT ? OFFSET ?'
            console.log(sql);
            const stmt = db.prepare(sql);
            return resovle(accloges = stmt.all(count, startid));
        } catch (err) {
            return reject(err);
        }
    });
}

async function getByCount() {
    var count : number;
    return new Promise(function(resolve,reject){
        try{
            const getCount = db.prepare('SELECT count(*) AS count FROM backupFileAccessLog');
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
            let sql = 'SELECT count(*) AS count FROM backupFileAccessLog  WHERE 1=1 ';
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

export { getById, getAll, getByCount, getByName, save ,getCountByQuery }
