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
  isVisible = false;
  remark = "";
  types = [
    {name:0,abbrev:'管理员'},
    {name:1,abbrev:'普通用户'}
  ];
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
    });
    // $scope.$apply();
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
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
      .subscribe(
        data => {this.goBack()},
        error =>{alert("保存失败")});
  }

  delete(user: User): void {
    this.usersService.delete(user)
      .subscribe(data => {
        alert("删除成功");
        this.goBack();
      } ,error => {
        alert("删除失败");
      });
  }

  handleCancel(): void {
    this.isVisible = false
    document.getElementById("dis").style.display = "none";
  }

  handleOk(): void {
    if(this.remark == undefined || this.remark == ""){
      document.getElementById("dis").style.display = "";
      return
    }
    console.log(this.user);
    this.usersService.delete(this.user.rowid);
    document.getElementById("dis").style.display = "none";
    this.isVisible = false;
  }

}

