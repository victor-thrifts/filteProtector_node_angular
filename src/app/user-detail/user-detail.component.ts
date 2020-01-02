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
  isCP: boolean = false;
  types = [
    {name:0,abbrev:'管理员'},
    {name:1,abbrev:'普通用户'}
  ];
  minLength: any;
  desc: any;
  regular: string;
  status:any={
    1: '必须为纯字母',
    2: '必须为纯数字',
    3: '至少为字母和数字组合'
  }
  reg:any={
    // 1: '^[A-Za-z]+$',
    // 2: '^\\d{0,}$',
    // 3: '^(?=.*[a-zA-Z])(?=.*\\d)[^]{0,}$'
    1: '^[A-Za-z]+$',
    2: '^[0-9]*$',
    3: '^(?![0-9]+$)(?![a-zA-Z]+$)'
  };

  constructor(
    private route: ActivatedRoute,
    private usersService: UserService,
    private location: Location,
    private modalService: NzModalService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    let { minLength , complex } = this.getSettings();
    this.minLength = minLength;
    this.desc = this.status[complex];
    this.regular = this.reg[complex];
    this.getUser();
  }

  getSettings(){
    try {
      let Settings = JSON.parse(sessionStorage.getItem("Settings"));
      return {
        minLength : Settings["minLength"],
        complex : Settings["complex"]
      }
    }catch (err) { return { minLength : 6, complex : 2}}
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

  showConfirm(): void {
    this.modalService.confirm({
      nzTitle: '<i>请确认是否修改用户?</i>',
      nzOnOk: () => {this.save()}
    });
  }

  save(): void {
    if(this.user.firstName == null || this.user.firstName == ''){
      return;
    }
    if(this.user.Password != null && this.user.Password != ''){
      if(this.user.Password.length < this.minLength){
        document.getElementById('pw').innerText='密码最小长度:'+ this.minLength;
        return;
      }
      if(!(new RegExp(this.regular).test(this.user.Password))){
        console.log(1111);
        document.getElementById('pw').innerText=this.desc;
        return;
      }
      document.getElementById('pw').style.display='none';
    }
    console.log(this.user.Password);
    console.log(this.user.ConfirmPassword);

    if(this.user.Password != this.user.ConfirmPassword){
      console.log(2222);
      this.isCP = true;
      return;
    }
    if(this.user.remark == null || this.user.remark ==''){
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

