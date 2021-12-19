import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { Subject } from "rxjs";

@Injectable()
export class UIService {
    loadingStateChanged = new Subject<boolean>();

    constructor(private snackbar: MatSnackBar) { }

    showSnackbar(message: string, action: string, _duration: number) {
        this.snackbar.open(message, action, {
            duration: _duration
        })
    }

    showSnackbarWithDirection(message: string, action: string, _duration: number, _h: MatSnackBarHorizontalPosition, _v: MatSnackBarVerticalPosition) {
        this.snackbar.open(
            message, action,
            {
                verticalPosition: _v,
                horizontalPosition: _h,
                duration: _duration
            }
        )
    }
}