import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConstants } from "../constants/app-constant";

@Injectable()
export class FieldServices {
    constructor(private http: HttpClient) { }

    getAllField(){
        return this.http.get(`${AppConstants.ServerUrl}api/Field`);
    }
}