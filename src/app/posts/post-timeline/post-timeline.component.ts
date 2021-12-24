import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BaseResponse } from 'src/app/base-model/base-response.model';
import { ModalDialogComponent } from 'src/app/shared/modal-dialog/modal-dialog.component';
import { UIService } from 'src/app/shared/ui.service';
import { FieldServices } from 'src/app/utilities/field.services';
import { User } from 'src/app/utilities/models/user.model';
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
  isLoading: boolean = false;
  isCollapsed: boolean = true
  isGoToTop: boolean = false;
  currentUser: User | null = null;

  ngOnInit(): void {
    let _currentUserStorage = localStorage.getItem('currentUser');
    if (_currentUserStorage) {
      const _currentUser = JSON.parse(_currentUserStorage);
      this.currentUser = _currentUser;
    }

    this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
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
  convertedDate(date: Date) {
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
  currentPage: number = 0;
  pageSize: number = 6;

  onScroll() {
    this.uiService.loadingStateChanged.next(true);
    this.currentPage = this.currentPage + 1;
    this.postService.getTimeline(this.currentPage * this.pageSize, this.pageSize).subscribe(res => {
      const response = res as BaseResponse<Array<TimelineModel>>;

      if (response.code === 200)
        this.dataSource = this.dataSource.concat(response.result);
      this.uiService.loadingStateChanged.next(false);
      if (this.currentPage > 1) {
        this.isGoToTop = true;
      }

    },
      error => {
        this.uiService.showSnackbar(error.message, "", 3000);
      })
  }

  openModal(postId: string) {
    let modalRef = this.modalService.open(ModalDialogComponent, {
      size: 'md',
      backdrop: 'static'
    })

    modalRef.componentInstance.postId = postId;
    modalRef.componentInstance.isAuthor = this.isAuthor(postId);
    modalRef.componentInstance.deletePost.subscribe((result: any) => {
      this.deletePost(result)
    })

  }

  isAuthor(postId: string) {
    let post = this.dataSource.find(x => x.oid === postId);
    if (post) {
      if (post.author_id === this.currentUser?.oid)
        return true;
    }
    return false;
  }
  deletePost(postId: string) {
    this.postService.deletePost(postId).subscribe((result: any) => {
      if (result.code === 200) {
        this.dataSource = this.dataSource.filter(x => x.oid != postId);
        this.uiService.showSnackbarWithDirection("Xóa bài viết thành công", "", 2000, 'end', 'top')
      }
    })
  }
}
