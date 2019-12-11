import { Component, OnInit } from '@angular/core';
import { Acclog} from '../_models/acclog';
import { AcclogService } from '../_services';
import { PageInfo } from '../_models/pageInfo';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  accloges: Acclog[] = [];

  constructor(private acclogService: AcclogService) { }

  ngOnInit() {
    this.getAccloges();
  }

  getAccloges(): void {
    // this.acclogService.getAccloges(0, 100)
    // .subscribe(accloges => this.accloges = PageInfo<Acclog[]>);
  }
}
