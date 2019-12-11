import { Component, OnInit } from '@angular/core';
import {PageEvent} from '@angular/material/paginator';

import { Acclog } from '../_models/acclog';
import { AcclogService } from '../_services'; 
import { PageInfo } from '../_models/pageInfo';

@Component({
  selector: 'app-accloges',
  templateUrl: './accloges.component.html',
  styleUrls: ['./accloges.component.css']
})
export class AcclogesComponent implements OnInit {
  accloges: Acclog[]; //数据集合
  page = 1; // 当前页
  pageSize = 20; // 每页条数
  pages = []; // 显示页数
  count:number; // 总条数
  pageCount = 0; //总页数
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private acclogService: AcclogService) { }

ngOnInit() {
  // this.getAcclogCount();
  this.getAcclogCount()
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  getAccloges(): void {
    this.acclogService.getAccloges(this.page, this.pageSize)
    .subscribe(accloges => this.accloges = accloges);
  }

  getAcclogCount(): void {
    let vm = this;
    this.acclogService.getAcclogCount()
    .subscribe(pageInfo => {
      vm.count = pageInfo.count;
//    console.log(pageInfo);
      console.log(this.count);
      vm.getAccloges();
      vm.calculateIndexes();
    });
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.acclogService.addAcclog(name)
      .subscribe(acclog => {
        this.accloges.push(acclog);
      });
  }

  delete(acclog: Acclog): void {
    this.acclogService.deleteAcclog(acclog)
        .subscribe(() => {
          this.accloges = this.accloges.filter(h => h !== acclog);
        });
  }

  next(): void {
    // if(this.page = this.pageCount){
    //   return;
    // }
    this.page = this.page + 1;
    this.acclogService.getAccloges(this.page, this.pageSize)
    .subscribe(accloges => this.accloges = accloges);
    this.calculateIndexes ();
  }

  prev(): void {
    this.page = this.page - 1;
    this.acclogService.getAccloges(this.page, this.pageSize)
    .subscribe(accloges => this.accloges = accloges);
    this.calculateIndexes ();
  }

  selectPage(page:number): void {
    alert(page);
  }

  // 分页算法
  calculateIndexes (): void {
    // this.getAcclogCount();
    console.log(this.count);
    this.pages = [];
    this.pageCount = Math.ceil(this.count/this.pageSize);
    // 普通情况，页数中没有首页和尾页
    var start = Math.round(this.page - 4 / 2);
    var end = Math.round(this.page + 4 / 2)-1;
    //页数中有首页
    if (start <1) {
      // console.log(start+"小于1")
      start = 1;
      // 默认显示的最后一个数字为设置的页码显示长度
      end = 4;
      if (end >= 2) {
          // console.log(end+"Da于"+length)
          // 短于设置的页码数，则为其本身长度
          end = this.pageCount;
      }
    }else if(end >= this.pageCount){
        //页数中有尾页
        //     console.log(end+"大于等于"+length)
        end = this.pageCount;
        start = end - 4 + 1;
        if (start <= 1) {
            start = 1;
        }
    }
    // 遍历生成数组
    for (var i = start; i <= end; i++) {
        this.pages.push(i);
    }
    console.log(this.pages);
  }
}
