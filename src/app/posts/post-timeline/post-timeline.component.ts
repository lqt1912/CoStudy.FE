import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BaseResponse } from 'src/app/base-model/base-response.model';
import { ModalDialogComponent } from 'src/app/shared/modal-dialog/modal-dialog.component';
import { UIService } from 'src/app/shared/ui.service';
import { TimelineModel } from '../models/post-timeline.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-timeline',
  templateUrl: './post-timeline.component.html',
  styleUrls: ['./post-timeline.component.css']
})
export class PostTimelineComponent implements OnInit {

  constructor(
    private postService: PostsService,
    private uiService: UIService,
    private modalService: NgbModal
  ) { }

  dataSource: Array<TimelineModel> = [];
  ngOnInit(): void {
    this.onScroll();
  }
  loadTimeline() {
    this.postService.getTimeline(0, 100).subscribe(
      res => {
        const response = res as BaseResponse<Array<TimelineModel>>;
        if (response.code === 200)
          this.dataSource = response.result;

        console.log(res);

      },
      error => {
        this.uiService.showSnackbar(error.message, "", 3000);
      }
    )
  }
  convertedDate(date:Date) {
    const convertedDate = moment(date);
    const currentDate = moment();
    let distance = Math.floor(currentDate.diff(convertedDate) / (1000 * 60));
    if (distance === 0) return 'Vừa xong';
    else if (distance <= 60) return `${distance} phút trước`;
    distance = Math.floor(distance / 60);
    if (distance < 23) return `${distance} giờ trước`;
    distance = Math.floor(distance / 24);
    if (distance < 7) return `${distance} ngày trước`;
    else return convertedDate.format('DD-MM-YYYY');
  }
  currentPage: number =0;
  pageSize: number = 6;

  onScroll(){
    this.currentPage = this.currentPage +1;
    this.postService.getTimeline(this.currentPage*this.pageSize, this.pageSize).subscribe(res => {
      const response = res as BaseResponse<Array<TimelineModel>>;
      console.log(response);
      
      if (response.code === 200)
        this.dataSource = this.dataSource.concat(response.result);
    },
    error => {
      this.uiService.showSnackbar(error.message, "", 3000);
    })
  }
  openModal(postId: string){
    let modalRef = this.modalService.open(ModalDialogComponent,{
      size: 'md',
      backdrop:'static'
    })

    modalRef.componentInstance.postId =postId ;
  }
}
