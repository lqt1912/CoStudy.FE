import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConstants } from "../constants/app-constant";

@Injectable()
export class FileService {

    constructor(private http: HttpClient) {

    }
    uploadFile(files: File, folder: string) {

        let formData = new FormData();
        formData.append('Files', files);

        formData.append('Folder', folder);
        return this.http.post(`${AppConstants.ServerUrl}api/File/file-upload`, formData);
    }

    uploadFiles(files: Array<File>, folder: string) {

        let formData = new FormData();
        files.forEach(element => {
        formData.append('Files', element);
        });

        formData.append('Folder', folder);
        return this.http.post(`${AppConstants.ServerUrl}api/File/file-upload`, formData);
    }
}