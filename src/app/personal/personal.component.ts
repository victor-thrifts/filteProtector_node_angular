import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { UserService } from '../_services';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopBarComponent } from "../_directives/top-bar/top-bar.component";
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})

export class PersonalComponent implements OnInit {

  modifyForm: FormGroup;
  loading = false;
  submitted = false;
  user: User;
  minLength: any;
  desc: any;
  status:any={
    1: '必须为纯字母',
    2: '必须为纯数字',
    3: '至少为字母和数字组合'
  }
  reg:any={
    1: '^[A-Za-z]+$',
    2: '^\\d{0,}$',
    3: '^(?=.*[a-zA-Z])(?=.*\\d)[^]{0,}$'
  }

  constructor(
    private message: NzMessageService,
    private formBuilder: FormBuilder,
    private usersService: UserService,
    private location: Location,
    private topBarComponent: TopBarComponent,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getUser();
    let { minLength , complex } = this.getSettings();
    this.minLength = minLength;
    this.desc = this.status[complex];
    this.modifyForm = this.formBuilder.group({
      originalPwd: ['',
        [Validators.required]],
      newPwd: ['',
        [Validators.required, Validators.minLength(minLength),
          Validators.pattern(this.reg[complex].replace(/[\d]/g,minLength))]],
      confirmPwd:['',
        [Validators.required, Validators.minLength(minLength),
          Validators.pattern(this.reg[complex].replace(/[\d]/g,minLength))]]
    });
  }

  getUser(): void {
    let { user, token } = JSON.parse(sessionStorage.getItem('currentUser'));
    const { sub } = jwt.verify(token, "config.secret");
    this.usersService.getById(sub).subscribe(user => {
      if(user.Enable == 1){
        this.modalService.confirm({
          nzTitle: '账户禁用提示',
          nzContent: '<b>该账户已被管理员禁用</b>',
          nzCancelText: null,
          nzCancelDisabled: false,
          nzOnOk: () => {this.topBarComponent.logout()}
        });
      }
      this.user = user;
    });
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

  goBack(): void { this.location.back() }
  get f() { return this.modifyForm.controls; }

  showConfirm(): void {
    this.modalService.confirm({
      nzTitle: '<i>请确认是否修改密码?</i>',
      nzOnOk: () => {this.onSubmit()}
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.modifyForm.invalid) {
      return;
    }
    if (!bcrypt.compareSync(this.modifyForm.value.originalPwd, this.user.Password)) {
      this.message.error("原密码输入错误");
      return;
    }
    if (this.modifyForm.value.newPwd != this.modifyForm.value.confirmPwd) {
      this.message.error("两次密码输入不一致");
      return;
    }
    // if(this.modifyForm.value.originalPwd == this.user.Password){
    //   alert("新密码不能和原始密码一样");
    //   return;
    // }
    this.user.Password = this.modifyForm.value.newPwd;
    this.usersService.update(this.user).subscribe(
      data => {
        this.message.success("修改密码成功！", { nzDuration: 5000 })
        this.topBarComponent.logout();
      },
      error => { this.message.error("保存密码失败！", { nzDuration: 5000 }) });
  }


}

