import { Component, OnInit } from '@angular/core';
import {LogAllService } from '../_services';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LogAll } from '../_models/logAll';
@Component({
  selector: 'app-logAlls',
  templateUrl: './logAlls.component.html',
  styleUrls: ['./logAlls.component.css']
})
export class LogAllsComponent implements OnInit {
  logAlls: LogAll[];
  page = 1; // 当前页
  pageSize = 20; // 每页条数
  pages = []; // 显示页数集合
  count:number; // 总条数
  pageCount = 0; //总页数
  pageLenght = 6; // 显示页数数量
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pdf: LogAll[];
  logAllForm = {Ip:'',Module:'',UserName:''};//查询条件
  constructor(private logAllService: LogAllService,private modalService: NzModalService) {
  }

  ngOnInit() {
    this.getLogAllCount()
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  getLogAlls(): void {
    this.logAllService.getLogAlls(this.page, this.pageSize, this.logAllForm)
    .subscribe(logAlls => this.logAlls = logAlls);
  }

  getLogAllCount(): void {
    let vm = this;
    this.logAllService.getLogAllCountByQuery(this.logAllForm)
    .subscribe(pageInfo => {
      vm.count = pageInfo.count;
      vm.getLogAlls();
      vm.calculateIndexes();
    });
  }

  queryFileLog(){
    this.page = 1;
    this.getLogAllCount();
  }

  exportLog() {
    // console.log(this.count);
    this.logAllService.getLogAlls(1, this.count,this.logAllForm).subscribe(
      pdf => {
        this.pdf = pdf;
        if (this.count === this.pdf.length) {
          let arrayData = [];
          let first = ['序号', '时间', '操作账号', '操作者IP', '模块', '操作对象','动作','备注'];
          arrayData.push(first);
          for (let i = 0; i < this.count; i++) {
            let arr = new Array();
            arr[0] = this.pdf[i].rowid;
            arr[1] = this.pdf[i].LogDate;
            arr[2] = this.pdf[i].UserName;
            arr[3] = this.pdf[i].Ip;
            arr[4] = this.pdf[i].Module;
            arr[5] = this.pdf[i].Operand;
            arr[6] = this.pdf[i].Action;
            arr[7] = this.pdf[i].Remark;
            arrayData.push(arr);
          }
          this.pdfmakes(arrayData);
        }
      }
    );
  }

  pdfmakes(arrayData) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-Italic.ttf'
      },
      /*这里是加入的微软雅黑字体*/
      jdstj: {
        normal: 'jdstj.ttf',
        bold: 'jdstj.ttf',
        italics: 'jdstj.ttf',
        bolditalics: 'jdstj.ttf',
      }
    }
    let data = {
      content: [{
        layout: 'lightHorizontalLines', // optional
        table: {
          headerRows: 1,
          widths: [ 30, 60, 50, 50, 50, 60, 60, 50],
          body: arrayData
        }
      }],
      defaultStyle: {
        font: 'jdstj'
      },
    };
    pdfMake.createPdf(data).download();
  }

  next(dis:number): void {
    if(dis == this.pageCount){
      return;
    }
    this.page = this.page + 1;
    this.logAllService.getLogAlls(this.page, this.pageSize,this.logAllForm)
    .subscribe(logAlls => this.logAlls = logAlls);
    this.calculateIndexes ();
  }

  prev(dis:number): void {
    if(dis == 1){
      return;
    }
    this.page = this.page - 1;
    this.logAllService.getLogAlls(this.page, this.pageSize,this.logAllForm)
    .subscribe(logAlls => this.logAlls = logAlls);
    this.calculateIndexes ();
  }

  selectPage(page:number): void {
    this.page = page;
    this.logAllService.getLogAlls(this.page, this.pageSize,this.logAllForm)
    .subscribe(logAlls => this.logAlls = logAlls);
    this.calculateIndexes ();
  }

  // 分页算法
  calculateIndexes (): void {
    // this.getAcclogCount();
    console.log(this.count);
    this.pages = [];
    this.pageCount = Math.ceil(this.count/this.pageSize);
    // 普通情况，页数中没有首页和尾页
    var start = Math.round(this.page - this.pageLenght / 2);
    var end = Math.round(this.page + this.pageLenght / 2)-1;
    //页数中有首页
    if (start <1) {
      // console.log(start+"小于1")
      start = 1;
      // 默认显示的最后一个数字为设置的页码显示长度
      end = this.pageLenght;
      if (end >= this.pageCount) {
          // console.log(end+"Da于"+length)
          // 短于设置的页码数，则为其本身长度
          end = this.pageCount;
      }
    }else if(end >= this.pageCount){
        //页数中有尾页
        //     console.log(end+"大于等于"+length)
        end = this.pageCount;
        start = end - this.pageLenght + 1;
        if (start <= 1) {
            start = 1;
        }
    }
    // 遍历生成数组
    for (var i = start; i <= end; i++) {
        this.pages.push(i);
    }
  }

  showDeleteConfirm(): void {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '请确认是否删除!',
      nzOnOk: () => console.log('OK'),
    });
  }

}
