import { join } from 'path';
import { save } from './db/db_acclog.service';
export const Integer = require('integer');
export const Iconv = require('iconv').Iconv;
export const ref = require('ref');
export const ffi = require('ffi');

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


export class ProtectionFolderSet{
    constructor(){}

    getProtectionFolder(){
         let pFolder = null;
        // pFolder = libm.getProtectionFolder(null);
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
        cstr1 = abuf.toString('ascii');
        console.log(cstr1);
        //libm.setProtectionFolder(cstr1);
    }

    setOpenProcess(cstr1){
        let abuf: Buffer = iconv.convert(cstr1);
        let len = Buffer.byteLength(abuf, 'ascii');
        let unicode_null = Buffer.from('\0','utf16le');
        let len1 = Buffer.byteLength(unicode_null,'ascii');
        abuf = Buffer.concat([abuf,unicode_null],len+len1);
        cstr1 = abuf.toString('ascii');
        console.log(cstr1);
        //libm.setOpenProcess(cstr1);
    }

    checklogs()
    {
        console.log('check the minisy log now!');
        setTimeout(()=>{
            //libm.SetGetRecCb(this.callback);
            //libm.GetRecords(null);
            this.checklogs();
        }, 1000);
    };

    callback = ffi.Callback(
        'void', ['string', 'char', 'string', 'string'], 
        function(fName, tag, time, writer) {
            let tag1 = String.fromCharCode(tag); 
            console.log("fileName: %s\n", fName);
            if(tag1 == "W") {
                tag1 = "修改";
            }else if(tag1 = "D"){
                tag1 = "删除";  
            }else if(tag1 == "R"){
                tag1 = "重命名";
            }
            console.log("tag: %s\n", tag1);
            console.log("time: %s", time);
            console.log("author: %s", writer);
            save({FileName: fName, AccessType: tag1, AccessTime: time, Author: writer});
        }
    )
}