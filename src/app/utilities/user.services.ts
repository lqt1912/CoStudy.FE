import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConstants } from "../constants/app-constant";

@Injectable()
export class UserServices {

    constructor(private http: HttpClient) {

    }

    getConfig() {
        let _loginInfo = localStorage.getItem('loginInfo');
        if (_loginInfo) {
            let loginInfo = JSON.parse(_loginInfo);
            return {
                Authorization: loginInfo.jwtToken
            }
        }
        return {
            Authorization: ''
        }
    }

    getCurrentUser() {
        return this.http.get(`${AppConstants.ServerUrl}api/User/current`, {
            headers: this.getConfig()
        });
    }
}