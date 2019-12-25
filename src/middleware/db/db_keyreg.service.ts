const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { Keyreg } from '../../app/_models/keyreg';
import { db } from '.';
import {L_Staticstaial_users, L_Staticstaial_count, L_Staticstical_expried, L_Staticstaial_check} from '../protectionfolderset';


function save(keyreg: Keyreg){
    return new Promise(function(resolve,reject){
        try{
            keyreg.RegisterKey = bcrypt.hashSync(keyreg.RegisterKey, 10);
            const stmt = db.prepare('DELETE FROM RegisterInfo');
            stmt.run();
            const stmt1 = db.prepare('INSERT INTO RegisterInfo(RegisterKey, CompanyName) VALUES(?, ?)');
            return resolve(stmt1.run(keyreg.RegisterKey, keyreg.CompanyName));
        } catch (err) {
            if (!db.inTransaction) throw err; // (transaction was forcefully rolled back)
            return reject(err);            
        }
    });
}

async function authsoft() {

    return {L_Staticstaial_users, L_Staticstaial_count, L_Staticstical_expried, L_Staticstaial_check};

    // const keyreg: Keyreg = await getKeyreg();
    // if (keyreg && bcrypt.compareSync("#@!#@!", keyreg.RegisterKey)) {
    //     return keyreg;
    // }
    // return null;
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


