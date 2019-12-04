import { Component, OnInit } from '@angular/core';
import {PageEvent} from '@angular/material/paginator';

import { Acclog } from '../_models/acclog';
import { AcclogService } from '../_services'; 

@Component({
  selector: 'app-accloges',
  templateUrl: './accloges.component.html',
  styleUrls: ['./accloges.component.css']
})
export class AcclogesComponent implements OnInit {
  accloges: Acclog[];
  recordsPerPage = 100;
  currentIndex = 0;
  pageEvent: PageEvent;
  pageSize = 10;
  length = 100;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private acclogService: AcclogService) { }

  ngOnInit() {
    this.getAccloges();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  getAccloges(): void {
    this.acclogService.getAccloges(this.currentIndex, this.recordsPerPage)
    .subscribe(accloges => this.accloges = accloges);
    this.currentIndex = this.currentIndex + 100;
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

}
