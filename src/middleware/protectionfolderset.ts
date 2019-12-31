import { join } from 'path';
import { save } from './db/db_acclog.service';
import { promise } from 'protractor';
import { userInfo } from 'os';
import { exists } from 'fs';
export const Integer = require('integer');
export const Iconv = require('iconv').Iconv;
export const ref = require('ref');
export const ffi = require('ffi');
export const wmi = require('node-wmi');
const fs = require('fs');
var cp  = require('child_process')


ffi.Library(join(process.cwd(), './dist/msvcr120'), {
});
ffi.Library(join(process.cwd(), './dist/msvcp120'), {
});
ffi.Library(join(process.cwd(), './dist/libcryptoMD'), {
});

let libj2c=
ffi.Library(join(process.cwd(), './dist/JavaCallcpp32'), {
    'check': ['int', ['void']],
    'checked': ['int', ['pointer']],
    'readLic': ['int', ['string']],
    'GetLinInfo': ['int', ['string']]
});


let info = new Buffer(100);
libj2c.GetLinInfo(info);
info = ref.readCString(info, 0);

export {L_Staticstaial_users, L_Staticstaial_count, L_Staticstical_expried, L_Staticstaial_check}

fs.writeFileSync('./dist/lic/fds.lin', info);

let liccounts = libj2c.readLic('./dist/');


let L_Staticstaial_check = libj2c.check('');


let intarr = new Int32Array(3);
let checked = libj2c.checked(intarr);
let L_Staticstaial_users = intarr[0];
let L_Staticstaial_count = intarr[1];
let L_Staticstical_expried = intarr[2];
console.log("License 登陆用户个数：" + L_Staticstaial_users);
console.log("License 服务数量：" + L_Staticstaial_count);
console.log("License 可用时间（天）：" + L_Staticstical_expried);

// if(L_Staticstaial_check == 0 ) 
// {
//     console.log("License 过期或不正确！！！");

//     var faultMessage = function() {
    
//      cp.exec('cscript.exe  ./dist/message.vbs' + ' "提示" "License 过期或不正确！！！"', 
//         function(err, stdout, stderr) {
//         if (1) throw 'License Problem';
//         }
//      )}
//     faultMessage();
//     process.exit();
// } 

// let libm =
// ffi.Library(join(process.cwd(), './dist/minispy'), {
//     'setProtectionFolder': ['pointer', ['string']],
//     'getProtectionFolder': ['string', ['void']],
//     'setOpenProcess':      ['void', ['string']],
//     'GetRecords':		   ['int',  ['void']],
//     'SetGetRecCb': ['int', [
//     ffi.Function(ref.types.void,[
//     ref.types.CString, 
//     ref.types.char, 
//     ref.types.CString, 
//     ref.types.CString,
//     ref.types.CString])]]
// });

let bb = Integer(1);
bb.plus(11);
console.log(bb.valueOf());
var iconv = new Iconv('UTF-8', 'UTF-16LE');
let abuf: Buffer = iconv.convert('字符串UTF-8');
let len = Buffer.byteLength(abuf, 'ascii');
let unicode_null = Buffer.from('\0','utf16le');
let len1 = Buffer.byteLength(unicode_null,'ascii');
Buffer.concat([abuf,],len+len1);
console.log(abuf.toString('ascii'));


var bios: any;
wmi.Query({class:'Win32_UserAccount'},(err, data) => {
    bios = data;
    console.log(bios);
});

function  wmiQuery(){
    return new Promise(function(resovle,reject){
        try {
            wmi.Query({class:'Win32_UserAccount'},(err, data) => {
                return resovle(bios = data);
            });
        } catch(err) {
            return resovle(err);
        }
    });
}
export class ProtectionFolderSet{
    constructor(){}

    getProtectionFolder(){
         let pFolder = null;
        //  pFolder = libm.getProtectionFolder(null);
         console.log(pFolder);
         let buf = ref.allocCString(pFolder);
         console.log(buf.toString());
    }

    setProtectionFolder(cstr1){
        let abuf: Buffer = iconv.convert(cstr1);
        let len = Buffer.byteLength(abuf, 'ascii');
        let unicode_null = Buffer.from('\0','utf16le');
        let len1 = Buffer.byteLength(unicode_null,'ascii');
        abuf = Buffer.concat([abuf,unicode_null],len+len1);
        // libm.setProtectionFolder(abuf);
    }

    setOpenProcess(cstr1){
        let abuf: Buffer = iconv.convert(cstr1);
        let len = Buffer.byteLength(abuf, 'ascii');
        let unicode_null = Buffer.from('\0','utf16le');
        let len1 = Buffer.byteLength(unicode_null,'ascii');
        abuf = Buffer.concat([abuf,unicode_null],len+len1);
        // libm.setOpenProcess(abuf);
    }

    checklogs()
    {
        console.log('check the minisy log now!');
        setTimeout(()=>{
            // libm.SetGetRecCb(this.callback);
            // libm.GetRecords(null);
            this.checklogs();
        }, 1000);
    };

    callback = ffi.Callback(
        'void', ['string', 'char', 'string', 'string', 'string'], 
        async function(fName, tag, time, writer,sid) {
            let tag1 = String.fromCharCode(tag);
            switch(tag1)
            {
            case "W":
                    tag1 = "修改";
                    break;
            case "D":
                    tag1 = "删除";
                    break;
            case "R":
                tag1 = "重命名";
                break;
            default:
                tag1 = "修改"; 
            } 
            console.log("fileName: %s\n", fName);
            console.log("tag: %s\n", tag1);
            console.log("time: %s", time);
            console.log("author: %s", writer);
            let userName;
            if (bios) {
                bios.forEach(element => {
                    if (element.SID == sid.trim()) {
                        userName = element.Name;
                        console.log("userName: %s\n",userName);
                        save({FileName: fName, AccessType: tag1, AccessTime: time, Author: writer, UserName: userName});
                        // return;
                    }
                });
            }
            else {
                wmiQuery().then(res => {
                    bios = res;
                    bios.forEach(element => {
                        if (element.SID == sid.trim()) {
                            userName = element.Name;
                            console.log("userName: %s\n",userName);
                            save({FileName: fName, AccessType: tag1, AccessTime: time, Author: writer, UserName: userName});
                            // return;
                        }
                    });
                });
            }
        }
    )
}