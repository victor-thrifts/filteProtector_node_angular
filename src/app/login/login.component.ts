import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { TopBarComponent } from '../_directives/top-bar/top-bar.component'

import { AlertService, AuthenticationService } from '../_services';

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
        private alertService: AlertService
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

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    let Isadmin = this.f.username.value == 'admin'? true: false;
                    let loggedIn = true;
                    this.router.navigate([this.returnUrl]);
                    this.alertService.setMessage({Isadmin:Isadmin, loggedIn:loggedIn});
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}