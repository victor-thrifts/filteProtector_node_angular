const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { Acclog } from '../../app/_models/acclog';
import { db } from '.';

async function getAll(startid, count) {
    var accloges: Acclog[];
    return new Promise(function(resovle,reject){
        try{
            const stmt = db.prepare('SELECT rowid, * FROM backupFileAccessLog ORDER BY AccessTime DESC LIMIT ? OFFSET ?'); 
            return resovle(accloges = stmt.all(count, startid));     
        } catch (err) { 
            return reject(err);
        }
    });
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
        'INSERT INTO backupFileAccessLog(FileName, AccessType, AccessTime, Author)  VALUES(@FileName, @AccessType, @AccessTime, @Author)');
    insert.run(acclogParam); 
    
}

export { getById, getAll, getByName, save }