const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { db } from '.'
import { User } from '../../app/_models/user';
import { authsoft } from './db_keyreg.service'

async function getById(id: Number) {
    const stmt = db.prepare('SELECT rowid, * FROM SystemUsers WHERE rowid=?');
    var user: User = await stmt.get(id);
    return user;
}

function getByName(name:string)
{
    return new Promise(
        function(resolve, reject) {
            const stmt = db.prepare('SELECT rowid, * FROM SystemUsers WHERE Name=?');
            try {
                let user = stmt.get(name);
                resolve(user);
            } catch (err) {
                if (!db.inTransaction) throw err; // (transaction was forcefully rolled back)
                return reject(err);
            }
        }
    );
}

async function _delete(id: Number) {
    const stmt = db.prepare('DELETE FROM SystemUsers WHERE rowid=?');
    await stmt.run(id);
}

function insert(user:User){
    return new Promise(function(resolve,reject){
        try{
            if(!user.Type) user.Type = 1;
            user.Password = bcrypt.hashSync(user.Password, 10);
            console.log('not Exists, Insert');
            const stmt = db.prepare('INSERT INTO SystemUsers(Name, Type, Password, firstName, lastName, remark) VALUES(?,?,?,?,?,?)');
            return resolve(stmt.run(user.Name, user.Type, user.Password, user.firstName, user.lastName, user.remark));
        } catch (err) {
            if (!db.inTransaction) throw err; // (transaction was forcefully rolled back)
            return reject(err);
        }
    });
}

async function getAll() {
    const stmt = db.prepare('SELECT rowid, * FROM SystemUsers');
    var users = await stmt.all();
    return users;
}

async function authenticate({ username, password }) {
    let ret = await authsoft();
    if(null == ret){
        do{
            console.log("invalid license!!!!");
        }
        while(1);
    };
    const user:any = await getByName(username);
    if (user && bcrypt.compareSync(password, user.Password)) {
        const token = jwt.sign({ sub: user.rowid }, "config.secret");
        password = user.Password;
        return {
            user: user.Name,
            type: user.Type,
            token
        };
    }
}
async function create(userParam: User) {
    // validate
    if (await getByName( userParam.Name )) {
        throw '账号 "' + userParam.Name + '" 已存在';
    }
    // save user
    await insert(userParam);
}

async function update(id: number, userParam: User) {
    const user = await getById(id);
    // validate
    if (!user) throw '用户已不存在';
    if (user.Name !== userParam.Name) throw '账号 "' + userParam.Name + '" 已存在';
    if (userParam.Password) {
        userParam.Password = bcrypt.hashSync(userParam.Password, 10);
    }else{
        userParam.Password = user.Password;
    }
    console.log('User, Update');
    const stmt = db.prepare('UPDATE SystemUsers SET Password=?, firstName=?, lastName=? ,Type=?, remark=? WHERE rowid=?');
    stmt.run(userParam.Password, userParam.firstName, userParam.lastName, userParam.Type, userParam.remark, userParam.rowid);
}

export { authenticate, create, getAll, getById, update, _delete};
