import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConstants } from "../constants/app-constant";

@Injectable()
export class ReportServices{
    constructor(
        private http: HttpClient
    ){

    }

    getAllReportReason(){
        return this.http.get(`${AppConstants.ServerUrl}api/ReportReason`);
    }

}