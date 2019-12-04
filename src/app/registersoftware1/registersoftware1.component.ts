import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../_services';
import  { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import { KeyregService } from '../_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registersoftware1',
  templateUrl: './registersoftware1.component.html',
  styleUrls: ['./registersoftware1.component.css']
})
export class Registersoftware1Component implements OnInit {
  registersoftwareForm: FormGroup;
  isBrowser: boolean;
  submitted = false;
  loading = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private location: Location,
    private router: Router,
    private keyregService: KeyregService,
  ) {   
    this.isBrowser = isPlatformBrowser(platformId)? true: false;
    console.log(platformId);
  }

  // convenience getter for easy access to form fields
  get f() { return this.registersoftwareForm.controls; }

  ngOnInit() {
    this.registersoftwareForm = this.formBuilder.group({
      registerKey: ['', [Validators.required, Validators.minLength(6)]],
      companyName: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registersoftwareForm.invalid) {
        return;
    }

    this.loading = true;
    this.keyregService.register(this.registersoftwareForm.value)
        .pipe(first())
        .subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                alert("软件注册成功");
                //this.location.back();
                this.router.navigate(['login']);
                
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
  }

}
