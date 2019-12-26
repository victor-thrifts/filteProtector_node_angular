import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import { AlertService, AuthenticationService, UserService } from '../_services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: [ './login.component.css' ]
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    isVisible = false;
    user: User;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private usersService: UserService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService,
    ) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        // reset login status
        this.authenticationService.logout();
        this.alertService.setMessage({Isadmin: false, loggedIn:false});

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        let username = this.f.username.value;
        // let errorCount = Cookies.get(username);
        let errorCount = sessionStorage.getItem(username);
        let lockLimit ; // default TODO whether using config file?
        try {
          lockLimit = JSON.parse(sessionStorage.getItem("Settings"))["lockLimit"];
        } catch(err) { lockLimit = 5;}

        if(errorCount != null && parseInt(errorCount) >= lockLimit){
          // let lockTime ;
          // try {
          //   lockTime = JSON.parse(sessionStorage.getItem("Settings"))["lockTime"];
          // } catch(err) { lockTime = '30';}
          // var inFifteenMinutes = new Date(new Date().getTime() + parseInt(lockTime) * 60 * 1000);
          // Cookies.set(username, 888, { expires: inFifteenMinutes });
          alert("该账户密码错误次数过多,已被系统锁定");
          return;
        }

        this.loading = true;
        this.authenticationService.login(username, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    if(!data.L_Staticstical_expried && (data.L_Staticstical_expried == 0))
                    {
                        this.alertService.error("error");
                        alert("软件证书还没硬件绑定！！！");
                        this.loading = false;
                        return;
                    }
                    const { sub } = jwt.verify(data["token"],"config.secret");
                    this.usersService.getById(sub).subscribe(user => {
                      if(user.Enable == 1){
                        alert("该账户已被管理员禁用");
                        this.loading = false;
                      }else{
                        if(!this.check(user.lastModifyTime)){
                          this.user = user;
                          return this.loading = false;
                        }
                        let Isadmin = data.type == 0 ? true: false;
                        let loggedIn = true;
                        this.router.navigate(['/dashboard']);
                        this.alertService.setMessage({Isadmin:Isadmin, loggedIn:loggedIn});
                      }
                    });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                    // null == errorCount ? Cookies.set(username,"1")
                    //   : Cookies.set(username,(parseInt(errorCount)+1).toString());
                    null == errorCount ? sessionStorage.setItem(username,"1")
                      : sessionStorage.setItem(username,(parseInt(errorCount)+1).toString());
                    alert("用户名或者密码错误.")
                });
    }

  check(lastModifyTime:string){
      let timeLimit,expire;
    try {
      let Settings = JSON.parse(sessionStorage.getItem("Settings"));
      timeLimit = Settings["lockTime"]
      expire = Settings["expire"]
    } catch(err) { timeLimit = '90'; expire = '5';}
    return this.showConfirmModal();
    let diff:any = (((new Date().getTime() - new Date(lastModifyTime).getTime()) / (1000 * 60 * 60 * 24))).toFixed(2);
    if((parseInt(timeLimit) - diff) <= 0){
      return this.showConfirmModal();
    }
    if ((parseInt(timeLimit) - diff) <= parseInt(expire)){
      return this.showInfoModal("您长时间未更新密码，请及时修改");
    }
    return true;
  }

  showInfoModal(info:any): boolean{
    this.modalService.create({
      nzTitle: '密码到期提醒',
      nzContent: '<b>'+info+'</b>',
      nzCancelText: null,
      nzOkText: null,
      nzKeyboard: true
    });
    return true;
  }

  showConfirmModal(){
    this.isVisible = true;
    return false;
  }

  forceModifyPassword(originalPwd,newPwd,confirmPwd){
    if(null == originalPwd || originalPwd.trim() == ''
      || null == newPwd || newPwd.trim() == ''
      || null == confirmPwd || confirmPwd.trim() == ''){
      this.nzMessageService.error("请填写必要信息");
      return false;
    }

    if(!bcrypt.compareSync(originalPwd,this.user.Password)){
      this.nzMessageService.error("原密码输入错误");
      return;
    }
    if(newPwd != confirmPwd){
      this.nzMessageService.error("两次密码输入不一致");
      return;
    }

    let minLength,complex;
    try{
      let Settings = JSON.parse(sessionStorage.getItem("Settings"));
      minLength = Settings["minLength"]
      complex = Settings["complex"]
    } catch(err){ minLength = 6; complex = "字母和数字组合";}

    let reg = new RegExp("^(?=.*[a-zA-Z])(?=.*\\d)[^]{"+minLength+",}$");
    if(!reg.test(newPwd) || !reg.test(confirmPwd)){
     this.nzMessageService.error("确认密码最少"+minLength+"位，且至少为"+complex);
     return;
    }

    this.user.Password = newPwd;
    this.usersService.update(this.user).subscribe(
      data => {
        this.nzMessageService.success("密码修改成功。即将刷新页面");
        //TODO refresh page},
      error =>{this.nzMessageService.error("密码修改失败")});
  }

}
