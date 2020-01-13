import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../_models/user';
import { LoginData } from '../../_models/logindata';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { environment } from '../../../environments/environment';
import { UtilitiesService } from '../../_services/utilities.service';
import { NotificationsService } from 'angular2-notifications';
import { CustomerService } from '../../customer/_customer-service/customer.service';
import { UserService } from '../../_services/user.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as JsEncryptModule from 'jsencrypt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    '../../../../node_modules/sweetalert2/src/sweetalert2.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  user: User;
  logindata: LoginData;
  loading: boolean;
  loginError: string;
  public options = {
    position: ['bottom', 'right'],
  };

  public keypadNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  constructor(
    private notifications: NotificationsService,
    private fb: FormBuilder,
    private auth: AuthService,
    private util: UtilitiesService,
    private userService: UserService,
    private router: Router,
    private customerService: CustomerService
  ) {
    debugger;
    this.createForm();
    this.keypadNumbers = this.shuffleKeyPad(this.keypadNumbers);
    let userName = (localStorage.getItem('userName') ? localStorage.getItem('userName') : '');
    console.log(userName);
    userName = this.util.decrypt(userName);
    this.loginForm.controls['Username'].setValue(userName);
  }

  createForm() {
    const reqID = this.util.generateNumber();
    this.loginForm = this.fb.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required],
      RememberMe: '',
      RequestID: reqID,
      Channel: environment.CHANNEL
    });
  }

  shuffleKeyPad(keyArray: any[]) {
    let c = keyArray.length;
    while (c > 0) {
      const i = Math.floor(Math.random() * c);
      c--;
      const t = keyArray[c];
      keyArray[c] = keyArray[i];
      keyArray[i] = t;
    }
    return keyArray;
  }

  ngOnInit() {
    this.customerService.getAcctDetailsData();
    this.auth.ibankLogout();
  }

  ngOnDestroy(): void {

  }

}
