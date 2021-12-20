import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { BaseResponse } from "../base-model/base-response.model";
import { AppConstants } from "../constants/app-constant";
import { LoginRequest } from "./model/custom-login-request.model";
import { LoginResult } from "./model/custom-login.model";

@Injectable()
export class CustomAuthService {
    authChange = new Subject<boolean>();
    loginChange = new Subject<string>();
    isAuthenticated: boolean = false;

    constructor(
        private http: HttpClient,
        private router: Router) { }

    login(_username: string, _password: string): Observable<any> {
        return this.http.post(`${AppConstants.ServerUrl}api/Accounts/login`, {
            email: _username,
            password: _password
        });
    }

    initAuthListener() {
        let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
        if (!loginInfo) {
            this.isAuthenticated = false;
            this.authChange.next(false);
            this.router.navigate(['/login']);
        } else {
            this.isAuthenticated = true;
            this.authChange.next(true);

            this.router.navigate(['/posts'])

        }
    }

    logout() {
        localStorage.removeItem('loginInfo');
        localStorage.removeItem('currentUser');
        this.authChange.next(false);
        this.router.navigate(['/login']);
    }

    isAuth() {
        return this.isAuthenticated;
    }
    setIsAuth() {
        this.isAuthenticated = true;
    }
}