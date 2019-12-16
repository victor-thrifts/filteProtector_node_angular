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
    const id = +this.route.snapshot.paramMap.get('id');
    this.usersService.getById(id).subscribe(user => {
      this.user = user;
      this.user.Password = null;
      console.log(this.user)
    });
    // $scope.$apply();
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    console.log(this.user);
    if(this.user.firstName == null || this.user.firstName == ''){
      alert("用户名必填");
    }
    if(this.user.Password != null && this.user.Password != '' && this.user.Password.length < 6){
      alert("密码必须大于六位");
      return;
    }
    if(this.user.Password != this.user.ConfirmPassword && this.user.Password !=''){
      alert("密码输入不一致");
      return;
    }
    this.usersService.update(this.user)
      .subscribe(()=>this.goBack());
  }

}

