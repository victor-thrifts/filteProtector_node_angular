import { Injectable, Optional, Inject, PLATFORM_ID, ReflectiveInjector, Provider } from '@angular/core';
import { DB } from './db';
import { apirouter } from './apirouter';
import { errorHandler } from './error-handler';
import { ProtectionFolderSet } from './protectionfolderset';
import * as logAllService from './db/db_logAll.service';

//export const Sequelize = require('sequelize');
//const sequelize = new Sequelize({ storage:'BackupProtector.db', dialect: 'sqlite' });

@Injectable()
export class MiddleWare {
    static provider: Provider[] =[
        {provide: MiddleWare, useClass: MiddleWare, deps:[DB]},
        {provide: DB, useClass: DB}
    ]
    constructor(
       @Inject(DB) db: Object 
    )
    {
        
    }
}

async function saveSettings(req, res, next)
{
       // validate

       // save user
    let settings: Settings = req.body;
    if(settings){
        if(settings.protectedFolder)
        {
            console.log(settings.protectedFolder);
            await protectionFolderSet.setProtectionFolder(settings.protectedFolder);
        }
        if(settings.exeName)
        {
            console.log(settings.exeName);
            await protectionFolderSet.setOpenProcess(settings.exeName);
        }
        //插入日志
        let logAll={
            UserName:req.headers.username,
            Module:"防空设置",
            Action:"添加目录 " + settings.protectedFolder,
            Describe:"添加目录 "  + settings.protectedFolder + " 添加程序 " + settings.exeName,
            Operand:"目录 " + settings.protectedFolder,
            Details:JSON.stringify(settings),
            Type:"3",
            Remark:settings.remark,
            Ip:"127.0.0.1"
        };
        logAllService.insertLogAll(logAll);
    }
    return res.json(settings);
}

apirouter.put('/settings', saveSettings);


export {apirouter, errorHandler};
export const bodyParser = require('body-parser');
export const urlencodedParser = bodyParser.urlencoded({ extended: false });
export const urljsonParser =  bodyParser.json();
export const jwt = require('./jwt');

let protectionFolderSet = new ProtectionFolderSet();
protectionFolderSet.checklogs();

class Settings{
    protectedFolder: string;
    exeName:  string;
    remark:string;
}