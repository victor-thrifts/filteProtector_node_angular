import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { TopBarComponent } from '../_directives/top-bar/top-bar.component'
import { AlertService, AuthenticationService, UserService } from '../_services';

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

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private usersService: UserService
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
                        let Isadmin = data.type == 0? true: false;
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

}
