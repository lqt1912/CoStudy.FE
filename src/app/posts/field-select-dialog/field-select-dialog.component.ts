import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseResponse } from 'src/app/base-model/base-response.model';
import { UIService } from 'src/app/shared/ui.service';
import { FieldServices } from 'src/app/utilities/field.services';
import { LevelServices } from 'src/app/utilities/level.service';
import { FieldResponse } from 'src/app/utilities/models/field-response.model';
import { LevelResponse } from 'src/app/utilities/models/level-response.model';

@Component({
  selector: 'app-field-select-dialog',
  templateUrl: './field-select-dialog.component.html',
  styleUrls: ['./field-select-dialog.component.css']
})
export class FieldSelectDialogComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private fieldService: FieldServices,
    private uiService: UIService,
    private levelService: LevelServices

  ) { }

  fields: Array<FieldResponse> = [];
  @Input() preSelected: any
  fieldSelected: any[] = [];
  isCollapsed: boolean = true;
  levels: any[] = [];
  @Output() selectedField = new EventEmitter<any>();

  ngOnInit(): void {

    this.fieldService.getAllField().subscribe(
      result => {
        let response = result as BaseResponse<Array<FieldResponse>>;
        if (response.code === 200) {
          this.fields = response.result;
          this.fieldSelected = [...this.fields];
          this.fieldSelected.forEach(x => {
            x.isSelected = false;
            x.isCollapsed = true;
            x.levelSelected = '';
          })
          this.preSelected?.forEach((element: any) => {
            let objIndex = this.fieldSelected.findIndex(x => x.oid === element.oid);
            if (typeof (objIndex) != undefined) {
              this.fieldSelected[objIndex].isSelected = true;
              this.fieldSelected[objIndex].levelSelected = element.levelSelected;
            }
          });

        }
      },
      error => {
        this.uiService.showSnackbar(error.message, "", 2000);
      }
    )

    this.levelService.getAllLevel().subscribe(
      result => {
        let response = result as BaseResponse<Array<LevelResponse>>;
        if (response.code === 200) {
          this.levels = response.result;
        }
      }
    )


  }

  selectField(id: string) {

    let objIndex = this.fieldSelected.findIndex(x => x.oid === id);
    if (typeof (objIndex) != undefined) {
      this.fieldSelected[objIndex].isSelected = true;
    }

  }

  isSelected(id: string): boolean {
    let obj = this.fieldSelected.find(x => x.oid === id && x.isSelected === true && x.levelSelected != '');
    if (obj) {
      return true;
    }
    return false;
  }
  select() {
    this.selectedField.emit(this.fieldSelected.filter(x => x.isSelected === true));
    this.activeModal.dismiss();
  }

  isLevelSelected(field: any, levelId: string): boolean {
    if (field.levelSelected === levelId)
      return true;
    return false;
  }

  selectLevel(item: any, levelId: string) {
    let fieldIndex = this.fieldSelected.findIndex(x => x.oid === item.oid);
    if (typeof (fieldIndex) != undefined) {
      this.fieldSelected[fieldIndex].levelSelected = levelId;
      this.fieldSelected[fieldIndex].isCollapsed = true;
      this.selectedField.emit(this.fieldSelected.filter(x => x.isSelected == true && x.levelSelected != ''));
    }
  }

  getLevelById(itemId: string): string {
    let obj = this.levels.find(x => x.oid === itemId);
    if (obj) {
      return obj.description;
    }
    return "";
  }
}
