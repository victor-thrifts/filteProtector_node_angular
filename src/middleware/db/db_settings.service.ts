import { db } from '.'

async function loadSettings(){
  const stmt = db.prepare('SELECT * FROM SystemSettings');
  var settings = await stmt.all();
  return settings;
}

async function update(config: Object){
  for(let cfg in config){
    const stmt = db.prepare('UPDATE SystemSettings SET Value = ? WHERE Name = "'+ cfg+'"');
    stmt.run(config[cfg]);
  }
}

export { loadSettings , update};
