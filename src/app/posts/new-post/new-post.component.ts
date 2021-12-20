import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/utilities/models/user.model';
import { UserServices } from 'src/app/utilities/user.services';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  constructor(
    private userService: UserServices
  ) { }
  currentUser: User | null = null;

  fileInput: any;
  ngOnInit(): void {
    let _currentUserStorage = localStorage.getItem('currentUser');
    if (_currentUserStorage) {
      const _currentUser = JSON.parse(_currentUserStorage);
      this.currentUser = _currentUser;
    }
  }
  selectImage(){
    console.log(this.fileInput);
  }
}
