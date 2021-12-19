import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomAuthService } from 'src/app/auth/custom-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth: boolean = false;
  authSubcription: Subscription;

  constructor(private customAuthService: CustomAuthService) { 
  
  }

  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {
    this.authSubcription = this.customAuthService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
    let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    if(loginInfo)
      this.isAuth = true;
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
  onLogout() {
    this.customAuthService.logout();
  }
}
