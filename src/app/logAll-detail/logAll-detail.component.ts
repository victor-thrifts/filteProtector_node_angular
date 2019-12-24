import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LogAll }         from '../_models/logAll';
import { LogAllService }  from '../_services'

@Component({
  selector: 'app-logAll-detail',
  templateUrl: './logAll-detail.component.html',
  styleUrls: [ './logAll-detail.component.css' ]
})
export class LogAllDetailComponent implements OnInit {
  logAll: LogAll;
  details;
  constructor(
    private route: ActivatedRoute,
    private logAllService: LogAllService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getLogAll();
  }

  getLogAll(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.logAllService.getLogAll(id)
      .subscribe(logAll => {
        this.logAll = logAll;
        let details = JSON.parse(logAll.Details);
        this.details = details;
      });
  }

  goBack(): void {
    this.location.back();
  }

}
