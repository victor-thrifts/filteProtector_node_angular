import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { UserService } from '../_services';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {validator} from "sequelize/types/lib/utils/validator-extras";
import { TopBarComponent } from "../_directives/top-bar/top-bar.component";

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

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UserService,
    private location: Location,
    private topBarComponent: TopBarComponent
  ) {}

  ngOnInit() {
    this.getUser();
    this.modifyForm = this.formBuilder.group({
      originalPwd: ['',
        [Validators.required]],
      newPwd: ['',
        [Validators.required, Validators.minLength(6),
          Validators.pattern("^(?=.*[a-zA-Z])(?=.*\\d)[^]{6,}$")]],
      confirmPwd:['',
        [Validators.required, Validators.minLength(6),
          Validators.pattern("^(?=.*[a-zA-Z])(?=.*\\d)[^]{6,}$")]]
    });
  }

  getUser(): void {
    let { user, token } = JSON.parse(sessionStorage.getItem('currentUser'));
    const { sub } = jwt.verify(token,"config.secret");
    this.usersService.getById(sub).subscribe(user => {
      this.user = user;
    });
  }

  goBack(): void { this.location }
  get f() { return this.modifyForm.controls; }

  onSubmit() {
    // validator.notEmpty(this.modifyForm.value.originalPwd);

    this.submitted = true;
    if (this.modifyForm.invalid) {
      return;
    }
    if(!bcrypt.compareSync(this.modifyForm.value.originalPwd,this.user.Password)){
      alert("原密码输入错误");
      return;
    }
    if(this.modifyForm.value.newPwd != this.modifyForm.value.confirmPwd){
      alert("两次密码输入不一致");
      return;
    }
    // if(this.modifyForm.value.originalPwd == this.user.Password){
    //   alert("新密码不能和原始密码一样");
    //   return;
    // }
    this.user.Password = this.modifyForm.value.newPwd;
    this.usersService.update(this.user).subscribe(
      data => {
        alert("密码修改成功.")
        this.topBarComponent.logout();},
      error =>{alert("修改密码失败")});
  }


}

