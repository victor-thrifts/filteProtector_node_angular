import { Component, OnInit } from '@angular/core';
import { Acclog } from '../_models/acclog';
import { AcclogService } from '../_services';
@Component({
  selector: 'app-accloges',
  templateUrl: './accloges.component.html',
  styleUrls: ['./accloges.component.css']
})
export class AcclogesComponent implements OnInit {
  accloges: Acclog[]; //数据集合
  page = 1; // 当前页
  pageSize = 20; // 每页条数
  pages = []; // 显示页数集合
  count:number; // 总条数
  pageCount = 0; //总页数
  pageLenght = 6; // 显示页数数量
  pageSizeOptions: number[] = [5, 10, 25, 100];
  constructor(private acclogService: AcclogService) { }

  ngOnInit() {
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

  next(dis:number): void {
    if(dis == this.pageCount){
      return;
    }
    this.page = this.page + 1;
    this.acclogService.getAccloges(this.page, this.pageSize)
    .subscribe(accloges => this.accloges = accloges);
    this.calculateIndexes ();
  }

  prev(dis:number): void {
    if(dis == 1){
      return;
    }
    this.page = this.page - 1;
    this.acclogService.getAccloges(this.page, this.pageSize)
    .subscribe(accloges => this.accloges = accloges);
    this.calculateIndexes ();
  }

  selectPage(page:number): void {
    this.page = page;
    this.acclogService.getAccloges(this.page, this.pageSize)
    .subscribe(accloges => this.accloges = accloges);
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
}
