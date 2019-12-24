import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';

import { AlertService, UserService } from '../_services';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    types = [
        {name:0,abbrev:'管理员'},
        {name:1,abbrev:'普通用户'}
    ];
    constructor(
        private formBuilder: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            Type: ['', Validators.required],
            Name: ['', Validators.required],
            remark: ['', Validators.required],
            Password: ['',
              [Validators.required, Validators.minLength(6),
              Validators.pattern("^(?=.*[a-z])(?=.*\\d)[^]{6,}$")]],
            ConfirmPassword:['',
              [Validators.required, Validators.minLength(6),
                Validators.pattern("^(?=.*[a-z])(?=.*\\d)[^]{6,}$")]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        if(this.registerForm.value.ConfirmPassword.trim() != this.registerForm.value.Password.trim()){
            alert("两次密码输入不一致");
            return;
        }
        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    alert("你已新建用户成功");
                    this.location.back();
                    this.loading = false;
                },
                error => {
                    alert(error);
                    // this.alertService.error(error);
                    this.loading = false;
                });
    }
    
    goBack(): void {
        this.location.back();
    }
}
