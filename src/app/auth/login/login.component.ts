import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseResponse } from 'src/app/base-model/base-response.model';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { CustomAuthService } from '../custom-auth.service';
import { LoginResult } from '../model/custom-login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading: boolean = false;
  loadingSubs: Subscription;
  constructor(private authService: AuthService,
    private uiService: UIService,
    private customAuthService: CustomAuthService,
    private router: Router) { }
  ngOnDestroy(): void {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }


  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
    this.loginForm = new FormGroup({
      email: new FormControl("", {
        validators: [Validators.required]
      }),
      password: new FormControl("", {
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {
    this.uiService.loadingStateChanged.next(true);
    this.customAuthService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(result => {
        console.log(result);
        if(result.code ===200){
          const response = result as BaseResponse<LoginResult>;
          localStorage.setItem('loginInfo', JSON.stringify(response.result));
          this.uiService.showSnackbar("Đăng nhập thành công", "", 3000);
          this.router.navigate(['./posts'])
          this.customAuthService.authChange.next(true);
          
        }
        this.uiService.loadingStateChanged.next(false);
        
      },
        error => {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar("Sai tên người dùng hoặc mật khẩu. ", "", 3000);
        });
  }
}
