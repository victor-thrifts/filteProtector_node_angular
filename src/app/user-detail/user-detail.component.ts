import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services';
import { Location } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: User;
  types = [
    {name:0,abbrev:'管理员'},
    {name:1,abbrev:'普通用户'}
  ];
  constructor(
    private route: ActivatedRoute,
    private usersService: UserService,
    private location: Location,
    private modalService: NzModalService,
    private message: NzMessageService
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
    if(this.user.remark == null || this.user.remark ==''){
      alert("请填写备注！");
      return;
    }
    this.usersService.update(this.user)
      .subscribe(
        data => {this.goBack();
          this.message.success("保存用户成功！",{nzDuration: 5000});
        },
        error =>{
          this.message.error("保存用户失败！",{nzDuration: 5000});
        });
  }

  delete(user: User): void {
    this.usersService.delete(user)
      .subscribe(data => {
        this.message.success("删除用户成功！",{nzDuration: 5000});
        this.goBack();
      } ,error => {
        this.message.error("删除用户失败！",{nzDuration: 5000});
      });
  }

  showDeleteConfirm(user: User): void {
    this.modalService.confirm({
      nzTitle: '请确认是否删除?',
      nzOkType: 'danger',
      nzOnOk: () => {
        if(this.user.remark == null || this.user.remark ==''){
          this.message.warning("请填写备注！",{nzDuration: 5000});
          return;
        }else{
          this.delete(user);
        }
      }
    })
  }

}

