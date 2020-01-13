import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { environment } from '../../environments/environment';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { throwError as _throw, throwError, Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { retry, catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { CurrencyPipe } from '@angular/common';
import * as JsEncryptModule from 'jsencrypt';

declare var Date: any;
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  private REQ_URL = environment.BASE_URL + environment.REQ_SERV;
  private CUS_URL = environment.BASE_URL + environment.CUST_SERV;
  public today = Date().replace(/[a-zA-Z]|\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  randomNumber: any;
  user: any;
  // Observable: Investments Stattus
  private chargesSource = new Subject<any>();
  charges$ = this.chargesSource.asObservable();
  private chargesErrorSource = new Subject<string>();
  chargesError$ = this.chargesErrorSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private notifications: NotificationsService,
    private userService: UserService,
    private cp: CurrencyPipe
  ) { }

  decrypt(hash) {
    const decrypt = new JsEncryptModule.JSEncrypt();
    decrypt.setPrivateKey(environment.PRIV_ENC_KEY);
    const data = decrypt.decrypt(hash);
    return data;
  }

  encrypt(data) {
    console.log('encrypting: ' + data);
    const encrypt = new JsEncryptModule.JSEncrypt();
    encrypt.setPublicKey(environment.PUB_ENC_KEY);
    const hash = encrypt.encrypt(data);
    return hash;
  }

  generateRequestId() {
    let reqID = '';
    this.user = this.userService.getUserDetails();
    if (this.user) {
      reqID = environment.CHANNEL_SHORTNAME + this.today + this.user.userId;
    } else {
      reqID = this.generateNumber();
    }
    return reqID;
  }

  generateNumber() {
    this.randomNumber = null;
    this.randomNumber =
      environment.CHANNEL_SHORTNAME +
      this.today +
      Math.floor(Math.random() * (999999999 - 10000000 + 1) + 10000000);
    return this.randomNumber;
  }

  addAuthParams(body) {
    this.user = this.userService.getUserDetails();
    console.log(this.user);
    if (this.user) {
      body.customerId = this.user.userId;
      body.customerNumber = this.user.userId;
      body.requestId = this.generateRequestId();
      body.channel = environment.CHANNEL;
      body.userId = this.user.userId;
      body.sessionId = localStorage.getItem('userToken');
    } else {
      console.log('Session is Expired');
      this.notifications.html(`Your session has expired`, NotificationType.Info, {
        id: 'login',
        timeOut: 10000,
        showProgressBar: true,
        animate: 'scale'
      });
      setTimeout(() => {
        this.router.navigate(['/onboarding/login']);
      }, 5000);
    }
    return body;
  }

  handleError(error?: HttpErrorResponse) {
    console.log(error);
    let errormessage;
    if (error.error instanceof ErrorEvent) {
      console.error('Network Error', error.error.message);
      errormessage = `Network Error ${error.error.message}`;
      console.log(errormessage);
    } else {
      console.error(`Backend returned code ${error.status},` + `body was: ${JSON.stringify(error.error.responseDescription)}`);
      if (error.statusText === 'Unknown Error') {
        errormessage = 'Opps! We are sorry. Our service is currently down. Please try *737# or use our GT Mobile app.';
      }
      errormessage = `${error.error.responseDescription || errormessage}`;
      console.log(errormessage);
    }
    console.log(errormessage);
    return throwError(`${errormessage.slice(errormessage.indexOf('-') + 1)}`);
  }

}
