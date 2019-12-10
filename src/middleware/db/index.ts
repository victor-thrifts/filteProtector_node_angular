import { Inject, Injectable, PLATFORM_ID, Provider } from '@angular/core';
const db_acclog = require('./acclog.controller');
const db_user = require('./user.controller');
const db_keyreg = require('./keyreg.controller');



const dboptions = {
    verbose: console.log,
    fileMustExist: true,
    memory: false,
    readonly: false
}

export const db = require('better-sqlite3')('BackupProtector.db', dboptions);
db.pragma('cache_size = 32000');
console.log(db.pragma('cache_size', {simple: true}));

@Injectable()
export class DB {
    private db: any;

    static providers: Provider[] = [ 
    ]  
    
    constructor(
    ){

    }
}
