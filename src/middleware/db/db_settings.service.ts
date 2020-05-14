import { db } from '.'
import { insertLogAll } from './db_logAll.service'

async function loadSettings(){
  const stmt = db.prepare('SELECT * FROM SystemSettings');
  var settings = await stmt.all();
  return settings;
}

async function update(config: Object,userName: string){
  for(let cfg in config){
    const stmt = db.prepare('UPDATE SystemSettings SET Value = ? WHERE Name = "'+ cfg+'"');
    stmt.run(config[cfg]);
  }
  let logAll={
    UserName: userName,
    Ip: "127.0.0.1",
    Operand: "系统设置",
    Module: "系统设置",
    Type: "4",
    Describe: "修改系统设置",
    Details: JSON.stringify(config),
    Action: "修改系统设置",
    Remark: ''
  };
  await insertLogAll(logAll);
}

export { loadSettings , update};
