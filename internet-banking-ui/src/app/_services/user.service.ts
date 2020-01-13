import { Injectable, OnDestroy, Component } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { retry } from 'rxjs/operators';
import { User } from '../_models/user';
// import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  public today = Date();
  randomNumber: any;

  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;
  private Req_URL = environment.BASE_URL + environment.REQ_SERV;
  // Observable string sources: user
  private userDetailSource = new BehaviorSubject<any[]>(null);
  private userErrorSource = new BehaviorSubject<any[]>(null);
  // Observable string streams: user
  userDetail$ = this.userDetailSource.asObservable();
  userError$ = this.userErrorSource.asObservable();
  // Customer Details Observable
  private customerDetailsSource = new Subject<CustomerInformation>();
  customerDetailsObserver = this.customerDetailsSource.asObservable();
  // Customer Details Observable
  private fullCustomerDetailsSource = new Subject<CustomerInformation>();
  fullCustomerDetailsObserver = this.fullCustomerDetailsSource.asObservable();

  constructor(private http: HttpClient) { }

  updateUser(user) {
    this.userDetailSource.next(user);
  }

  updateUserError(error) {
    this.userErrorSource.next(error);
  }

  getUserDetails(): User {
    let userDetails = null;
    this.userDetail$.pipe(untilDestroyed(this)).subscribe(user => (userDetails = user));
    if (!userDetails) {
      userDetails = JSON.parse(localStorage.getItem('userDetails'));
    }
    return userDetails;
  }

  ngOnDestroy(): void {}
}

export interface CustomerInformation {
  birthday: string;
  bvn: string;
  customerNumber: string;
  customerSegment: string;
  customerType: string;
  email: string;
  gender: string;
  name: string;
  phone: string;
  residentialAddress: string;
}