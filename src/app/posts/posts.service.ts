import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppConstants } from "../constants/app-constant";

@Injectable()
export class PostsService {
    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    getConfig() {
        let _loginInfo = localStorage.getItem('loginInfo');
        if (_loginInfo) {
            let loginInfo = JSON.parse(_loginInfo);
            return {
                Authorization: loginInfo.jwtToken
            }
        } else return {
            Authorization: ''
        }
    }
    getTimeline(skip: number, count: number) {
        return this.http.post(`${AppConstants.ServerUrl}api/Post/timeline`, {
            skip: skip,
            count: count
        }, {
            headers: this.getConfig()
        })
    }
}