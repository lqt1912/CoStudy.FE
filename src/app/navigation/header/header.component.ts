import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomAuthService } from 'src/app/auth/custom-auth.service';
import { User } from 'src/app/utilities/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth: boolean = false;
  authSubcription: Subscription = new Subscription();
  currentUser: User | null = null;
  currentUserName : string ='';
  collapsed = true;
  constructor(private customAuthService: CustomAuthService) {

  }

  ngOnDestroy(): void {
    this.authSubcription.unsubscribe();
  }

  ngOnInit(): void {
    this.authSubcription = this.customAuthService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })

    this.authSubcription.add(
      this.customAuthService.loginChange.subscribe(userName =>{
        this.currentUserName = userName;
      })
    )
    let loginInfo = localStorage.getItem('loginInfo');
    if (loginInfo) {
      this.isAuth = true;
      let _currentUser = localStorage.getItem('currentUser');
      if (_currentUser) {
        this.currentUser = JSON.parse(_currentUser)
      }
    }
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
  onLogout() {
    this.customAuthService.logout();
  }
}
