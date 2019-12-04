import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Acclog }         from '../_models/acclog';
import { AcclogService }  from '../_services'

@Component({
  selector: 'app-acclog-detail',
  templateUrl: './acclog-detail.component.html',
  styleUrls: [ './acclog-detail.component.css' ]
})
export class AcclogDetailComponent implements OnInit {
  acclog: Acclog;

  constructor(
    private route: ActivatedRoute,
    private acclogService: AcclogService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getAcclog();
  }

  getAcclog(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.acclogService.getAcclog(id)
      .subscribe(acclog => this.acclog = acclog);
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.acclogService.updateAcclog(this.acclog)
      .subscribe(() => this.goBack());
  }
}
