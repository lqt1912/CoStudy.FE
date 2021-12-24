import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseResponse } from 'src/app/base-model/base-response.model';
import { UIService } from 'src/app/shared/ui.service';
import { FileService } from 'src/app/utilities/file.service';
import { LevelServices } from 'src/app/utilities/level.service';
import { LevelResponse } from 'src/app/utilities/models/level-response.model';
import { User } from 'src/app/utilities/models/user.model';
import { UserServices } from 'src/app/utilities/user.services';
import { FieldSelectDialogComponent } from '../field-select-dialog/field-select-dialog.component';
import { NewPostRequest } from '../models/new-post-request.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  constructor(
    private userService: UserServices,
    private sanitizer: DomSanitizer,
    private uiService: UIService,
    private modalService: NgbModal,
    private levelService: LevelServices,
    private fileService: FileService,
    private postService: PostsService,
  ) { }
  currentUser: User | null = null;

  fileInput: any;
  previewUrl: string = '';
  selectedField: any;
  postType: number = 0;
  levels: any[] = [];
  newPostRequest: NewPostRequest = {
    title: '',
    string_contents: [],
    image_contents: [],
    fields: [], post_type: 0
  };
  isLoading: boolean = false
  title: string = '';
  postContent: string = '';
  ngOnInit(): void {
    this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
    let _currentUserStorage = localStorage.getItem('currentUser');
    if (_currentUserStorage) {
      const _currentUser = JSON.parse(_currentUserStorage);
      this.currentUser = _currentUser;
    }

    this.levelService.getAllLevel().subscribe(
      result => {
        let response = result as BaseResponse<Array<LevelResponse>>;
        if (response.code === 200) {
          this.levels = response.result;
        }
      }
    )
  }

  filePreviews: any[] = [];

  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  selectImage(e: any) {
    console.log(e.target.files);
    let a = e.target.files;
    if (a.length >= 4) {
      this.uiService.showSnackbar("Không được chọn quá 3 ảnh", "", 3000);
      return;
    }
    this.filePreviews = [];
    for (let index = 0; index < a.length; index++) {
      const element = a[index];
      let _key = URL.createObjectURL(element);
      this.filePreviews.push({
        fileName: element.name,
        blobUrl: _key,
        fullFile: element,
        key: _key
      })
    }
  }
  removeFile(key: string) {
    this.filePreviews = this.filePreviews.filter(x => !(x.key === key));
    console.log(this.filePreviews);
  }

  openModal() {
    const modalRef = this.modalService.open(FieldSelectDialogComponent);
    modalRef.componentInstance.preSelected = this.selectedField
    modalRef.componentInstance.selectedField.subscribe((res: any) => {
      this.selectedField = res;
    })
  }

  isPostTypeSelected(postType: number) {

    return this.postType === postType;
  }
  selectPostType(postType: number) {
    this.postType = postType;
    console.log(this.postType);

  }
  getLevelById(itemId: string): string {
    let obj = this.levels.find(x => x.oid === itemId);
    if (obj) {
      return obj.description;
    }
    return "";
  }
  sendPost() {
    this.uiService.loadingStateChanged.next(true);
    this.newPostRequest.title = this.title;
    this.newPostRequest.post_type = this.postType;
    this.newPostRequest.fields = this.selectedField?.map((x: any) => ({
      level_id: x.levelSelected,
      field_id: x.oid
    }))
    this.newPostRequest.string_contents = [{
      content_type: 0,
      content: this.postContent
    }];


    this.filePreviews.forEach(file => {
      this.fileService.uploadFile(file.fullFile, 'posts').subscribe((result: any) => {

      })
    })

    let fileArray = this.filePreviews.map(x => (x.fullFile));
    if (this.filePreviews.length > 0) {
      this.fileService.uploadFiles(fileArray, 'posts').subscribe((result: any) => {
        result.result.forEach((element: any) => {
          this.newPostRequest.image_contents.push({
            discription: 'This is description',
            image_hash: element
          })
        });

        if (this.validatePost(this.newPostRequest)) {
          this.postService.addPost(this.newPostRequest).subscribe(result => {
            this.uiService.loadingStateChanged.next(false)
            console.log(result);
          })
        } else {
          this.uiService.loadingStateChanged.next(false)

          return;
        }

      })
    } else {
      if (this.validatePost(this.newPostRequest)) {
        this.postService.addPost(this.newPostRequest).subscribe(result => {
          this.uiService.loadingStateChanged.next(false)
          console.log(result);
        })
      } else {
        this.uiService.loadingStateChanged.next(false)

        return;
      }
    }

  }

  validatePost(post: NewPostRequest) {
    if (post.title === '' || post.post_type === null || post.string_contents.length === 0 || post.fields.length === 0) {
      this.uiService.showSnackbar('Vui lòng nhập bài viết', "", 2000);
      return false;
    }
    return true;
  }
}
