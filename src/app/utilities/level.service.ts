import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConstants } from "../constants/app-constant";

@Injectable()
export class LevelServices {

    constructor(private http: HttpClient) { }

    getAllLevel() {
        return this.http.get(`${AppConstants.ServerUrl}api/Level/level/all`);
    }
}