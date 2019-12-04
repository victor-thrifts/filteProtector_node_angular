import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Acclog } from '../_models/acclog';
import { AcclogService } from '../_services';

@Component({
  selector: 'acclog-search',
  templateUrl: './acclog-search.component.html',
  styleUrls: [ './acclog-search.component.css' ]
})
export class AcclogSearchComponent implements OnInit {
  accloges: Observable<Acclog[]>;
  private searchTerms = new Subject<string>();

  constructor(private acclogService: AcclogService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.accloges = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.acclogService.searchAccloges(term)),
    );
  }
}
