import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseResponse } from 'src/app/base-model/base-response.model';
import { UIService } from 'src/app/shared/ui.service';
import { User } from 'src/app/utilities/models/user.model';
import { UserServices } from 'src/app/utilities/user.services';
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
  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private customAuthService: CustomAuthService,
    private router: Router,
    private userService: UserServices) { }
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
        if (result.code === 200) {
          const response = result as BaseResponse<LoginResult>;
          localStorage.setItem('loginInfo', JSON.stringify(response.result));
          this.uiService.showSnackbar("Đăng nhập thành công", "", 3000);
          this.customAuthService.authChange.next(true);
          this.customAuthService.setIsAuth();
          this.userService.getCurrentUser().subscribe(
            result => {
              const currentUserResponse = result as BaseResponse<User>;
              if (currentUserResponse.code === 200) {
                localStorage.setItem('currentUser', JSON.stringify(currentUserResponse.result))
                this.customAuthService.loginChange.next(currentUserResponse.result.full_name);
              }
            },
            error => {
              this.uiService.showSnackbar(error.message, "", 3000);
            }
          )

          this.router.navigate(['./posts'])
        }
        this.uiService.loadingStateChanged.next(false);
      },
        error => {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar("Sai tên người dùng hoặc mật khẩu. ", "", 3000);
        });
  }
}
