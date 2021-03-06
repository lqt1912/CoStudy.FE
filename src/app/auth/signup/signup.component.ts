import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  maxDate: any;
  loadingSubs: Subscription = new Subscription();
  isLoading: boolean = false;


  constructor(private authService: AuthService, private uiService: UIService) { }
  ngOnDestroy(): void {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading
    })
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
  }

  onSubmit(form: NgForm) {

    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }
}
