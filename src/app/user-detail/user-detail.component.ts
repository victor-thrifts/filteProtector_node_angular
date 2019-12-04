import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: User;
  constructor(
    private route: ActivatedRoute,
    private usersService: UserService,
    private location: Location
  ) { 

  }

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    const id: any = this.route.snapshot.paramMap.get('id');
    this.usersService.getById(id)
      .subscribe(user => this.user = user);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.usersService.update(this.user)
      .subscribe(()=>this.goBack());
  }

}

