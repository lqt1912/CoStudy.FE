import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TransitionCheckState } from '@angular/material/checkbox';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseResponse } from 'src/app/base-model/base-response.model';
import { ReportReason } from 'src/app/utilities/models/report-response.model';
import { ReportServices } from 'src/app/utilities/report.services';
import { UIService } from '../ui.service';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit {

  @Input() postId: string = '';
  @Input() isAuthor: boolean = false;
  @Output() deletePost = new EventEmitter()
  constructor(
    public activeModal: NgbActiveModal,
    private reportService: ReportServices,
    private uiService: UIService
  ) { }

  reportReasons: Array<ReportReason> = []
  reportReasonsSubmit: any[] = []
  public isCollapsed = true;

  reportReasonForm = new FormControl();

  ngOnInit(): void {
    this.reportService.getAllReportReason().subscribe(
      result => {
        let response = result as BaseResponse<ReportReason[]>;
        if (response.code === 200) {
          this.reportReasons = response.result;
          this.reportReasons.forEach(element => {
            this.reportReasonsSubmit.push({
              id: element.oid,
              name: element.detail,
              isSelected: false
            })
          });
        }
      },
      error => {
        this.uiService.showSnackbar(error.message, "", 3000)
      }
    )


  }

  close() {
    this.activeModal.close();
  }
  selectReason(id: string) {
    let objIndex = this.reportReasonsSubmit.findIndex(x => x.id === id);
    if (typeof (objIndex) != undefined) {
      this.reportReasonsSubmit[objIndex].isSelected = true;
    }
  }

  report() {
    console.log(this.reportReasonsSubmit.filter(x => x.isSelected === true));
    this.activeModal.dismiss();
    this.uiService.showSnackbarWithDirection(this.postId, "close", 2000, 'end', 'top')
  }
  deleteMyPost() {
    this.activeModal.close()
    this.deletePost.emit(this.postId);
  }
}
