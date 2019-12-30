import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {Location} from '@angular/common';
import {NzMessageService} from 'ng-zorro-antd/message';
import {AlertService, UserService} from '../_services';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  types = [
    {name: 0, abbrev: '管理员'},
    {name: 1, abbrev: '普通用户'}
  ];

  constructor(
    private message: NzMessageService,
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private modalService: NzModalService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      Type: ['', Validators.required],
      Name: ['', Validators.required],
      remark: ['', Validators.required],
      Password: ['',
        [Validators.required, Validators.minLength(6),
          Validators.pattern("^(?=.*[a-z])(?=.*\\d)[^]{6,}$")]],
      ConfirmPassword: ['',
        [Validators.required, Validators.minLength(6),
          Validators.pattern("^(?=.*[a-z])(?=.*\\d)[^]{6,}$")]]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  showConfirm(): void {
    this.modalService.confirm({
      nzTitle: '<i>请确认是否添加用户?</i>',
      nzOnOk: () => {
        this.onSubmit()
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if (this.registerForm.value.ConfirmPassword.trim() != this.registerForm.value.Password.trim()) {
      alert("两次密码输入不一致");
      return;
    }
    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful', true);
          this.message.success("添加用户成功！", {nzDuration: 5000})
          this.location.back();
          this.loading = false;
        },
        error => {
          this.message.error("添加用户失败！", {nzDuration: 5000})
          this.loading = false;
        });
  }

  goBack(): void {
    this.location.back();
  }
}
