const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { db } from '.'
import { User } from '../../app/_models/user';
import { authsoft } from './db_keyreg.service'
import { insertLogAll } from './db_logAll.service'
import { LogAll } from '../../app/_models/logAll';
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

async function _delete(id: Number, remark: string, userName: String) {
    const user = await getById(id);
    const stmt = db.prepare('DELETE FROM SystemUsers WHERE rowid=?');
    let newVar = await stmt.run(id);
    let parse = JSON.parse(JSON.stringify(newVar));
    console.log(newVar);
    console.log(remark);
    if (parse.changes === 1) {
      user.ConfirmPassword = '';
      user.Password = '';
      let logAll = {
        UserName: userName,
        Ip: "127.0.0.1",
        // LogDate:
        Operand: "账号 " + user.Name,
        Module: "用户管理",
        Type: "2",
        Describe: "删除用户 " + user.Name,
        Details: JSON.stringify(user),
        Action: "删除用户",
        Remark: remark
      };
      await insertLogAll(logAll);
    }

}

async function insert(user:User, userName: String){
  let newVar = await insertUser(user);
  let parse = JSON.parse(JSON.stringify(newVar));
  if (parse.changes === 1){
    user.ConfirmPassword = '';
    user.Password = '';
    let logAll={
                UserName: userName,
                Ip: "127.0.0.1",
                // LogDate:
                Operand: "账号 " + user.Name,
                Module: "用户管理",
                Type: "2",
                Describe: "添加用户 " + user.Name,
                Details: JSON.stringify(user),
                Action: "添加用户",
                Remark: user.remark
              };
     await insertLogAll(logAll);
  }
  return newVar;
}

async function insertUser(user:User){
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
    let {L_Staticstaial_users, L_Staticstaial_count, L_Staticstical_expried, L_Staticstaial_check} = await authsoft();
    if(L_Staticstaial_check==0){
        // do{
        //     console.log("invalid license!!!!");
        // }
        // while(1);
        setTimeout(()=>{
                process.exit(0);
            },1000);
        return  {L_Staticstaial_users, L_Staticstaial_count, L_Staticstical_expried, L_Staticstaial_check};
    };
    const user:any = await getByName(username);
    if (user && bcrypt.compareSync(password, user.Password)) {
        const token = jwt.sign({ sub: user.rowid }, "config.secret");
        password = user.Password;
        if(user.Enable == 0){
          //插入日志
          let logAll={
              UserName:username,
              Module:"用户登录",
              Action:"登录成功",
              Describe:"成功登录账号 " + username,
              Operand:"账号 " + username,
              Details:JSON.stringify(user),
              Type:"1",
              Remark:"",
              Ip:"127.0.0.1"
          };
          await insertLogAll(logAll);
        }
        return {
            user: user.Name,
            type: user.Type,
            token
        };
    }else{
      let logAll={
        UserName:username,
        Module:"用户登录",
        Action:"登录失败",
        Describe:"登录账号 " + username + " 失败！原因：用户名或密码错误",
        Operand:"账号 " + username,
        Details:JSON.stringify(user),
        Type:"0",
        Remark:"",
        Ip:"127.0.0.1"
      };
      await insertLogAll(logAll);
    }
}
async function create(userParam: User, userNmae: String) {
    // validate
    if (await getByName( userParam.Name )) {
        throw '账号 "' + userParam.Name + '" 已存在';
    }
    // save user
    let len = await insert(userParam,userNmae);
}

async function update(id: number, userParam: User, userName: String) {
    const user = await getById(id);
    // validate
    if (!user) throw '用户已不存在';
    if (user.Name !== userParam.Name) throw '账号 "' + userParam.Name + '" 已存在';
    let sql ;
    if (userParam.Password) {
        userParam.Password = bcrypt.hashSync(userParam.Password, 10);
        sql = 'UPDATE SystemUsers SET Password=?, firstName=?, lastName=? ,Type=? , Enable=?, remark=?, lastModifyTime = datetime(CURRENT_TIMESTAMP,"localtime") WHERE rowid=?'
    }else{
        userParam.Password = user.Password;
        sql = 'UPDATE SystemUsers SET Password=?, firstName=?, lastName=? ,Type=?, Enable=?, remark=? WHERE rowid=?';
    }
    console.log('User, Update');
    const stmt = db.prepare(sql);
    let newVar = await stmt.run(userParam.Password, userParam.firstName, userParam.lastName, userParam.Type, userParam.Enable, userParam.remark, userParam.rowid);
    let parse = JSON.parse(JSON.stringify(newVar));
    if (parse.changes === 1){
      userParam.ConfirmPassword = '';
      userParam.Password = '';
      let logAll={
        UserName: userName,
        Ip: "127.0.0.1",
        // LogDate:
        Operand: "账号 " + userParam.Name,
        Module: "用户管理",
        Type: "2",
        Describe: "修改用户 " + userParam.Name,
        Details: JSON.stringify(userParam),
        Action: "修改用户",
        Remark: userParam.remark
      };
      await insertLogAll(logAll);
    }
}

export { authenticate, create, getAll, getById, update, _delete};
