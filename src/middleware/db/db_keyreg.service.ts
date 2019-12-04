const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { Keyreg } from '../../app/_models/keyreg';
import { db } from '.';


function save(keyreg: Keyreg){
    return new Promise(function(resolve,reject){
        try{
            bcrypt.hashSync(keyreg.RegisterKey, 10);
            const stmt = db.prepare('DELETE FROM RegisterInfo; INSERT INTO RegisterInfo(RegisterKey, CompanyName) VALUES(?, ?)');
            return resolve(stmt.run(keyreg.RegisterKey, keyreg.CompanyName));
        } catch (err) {
            if (!db.inTransaction) throw err; // (transaction was forcefully rolled back)
            return reject(err);            
        }
    });
}

async function authsoft() {
    const keyreg: Keyreg = await getKeyreg();
    if (keyreg && bcrypt.compareSync("#@!#@!", keyreg.RegisterKey)) {
        return keyreg;
    }
}


function getKeyreg() {
    return new Promise<Keyreg>(function(resolve,reject){
        try{
            const stmt = db.prepare('SELECT * FROM RegisterInfo LIMIT 1'); 
            return resolve(stmt.get());
        } catch (err) {
            return reject(err);
        }
    })
}


export {save, authsoft};


