import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "../material.module";
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        NgbModule, 
        MatIconModule,
        ReactiveFormsModule,
        MatSelectModule
         
    ],
    exports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule
    ],
    declarations: [
        ModalDialogComponent
    ]
}) export class SharedModule { }