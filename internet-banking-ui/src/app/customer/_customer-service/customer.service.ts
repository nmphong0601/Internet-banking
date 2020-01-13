import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { UtilitiesService } from '../../_services/utilities.service';
import {
  AcctToDebit,
  AcctToDebitResponse,
  AcctToDebitFX,
  // AcctToDebitFXResponse,
  Beneficiaries,
  Beneficiary,
  Banks,
  PreRegBeneficiariesResponse,
  AcctDetails,
  FxBeneficiaries
} from '../_customer-model/customer.model';
import { Router } from '@angular/router';
// import { LocalStorage } from '@ng-idle/core';
import { PreRegBeneficiaries } from '../_customer-model/customer.model';
import { UserService } from '../../_services/user.service';
// import { BankBranches } from '../cards/card-replacement/card-replacement.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements OnDestroy {

  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;
  private REQ_URL = environment.BASE_URL + environment.REQ_SERV;

  // Observable string sources: Account Details
  private acctDetailSource = new BehaviorSubject<AcctDetails[]>(null);
  acctDetail$ = this.acctDetailSource.asObservable();
  private selectedAcctDetailSource = new BehaviorSubject<AcctDetails>(null);
  selectedAcctDetail$ = this.selectedAcctDetailSource.asObservable();
  private acctDetailErrorSource = new BehaviorSubject<string>(null);
  acctDetailError$ = this.acctDetailErrorSource.asObservable();
  // End Observable string streams: Account Details

  // Observable string sources: Account to debit
  private acctToDebitSource = new BehaviorSubject<AcctToDebit[]>([]);
  acctToDebit$ = this.acctToDebitSource.asObservable();
  private selectedAcctToDebitSource = new BehaviorSubject<AcctToDebit>({
    'accountBalance': '', 'accountName': '', 'fullAcctKey': '', 'nuban': ''
  });
  selectedAcctToDebit$ = this.selectedAcctToDebitSource.asObservable();
  private acctToDebitErrorSource = new BehaviorSubject<string>('Empty');
  acctToDebitError$ = this.acctToDebitErrorSource.asObservable();
  // End Observable string streams: Account to debit

  // Observable string sources: Account to debitFX added by Sola - 25/07/2018
  private acctToDebitFXSource = new BehaviorSubject<AcctToDebitFX[]>([]);
  acctToDebitFX$ = this.acctToDebitFXSource.asObservable();
  private selectedAcctToDebitFXSource = new BehaviorSubject<AcctToDebitFX>({
    'accountBalance': '', 'accountName': '', 'fullAcctKey': '', 'nuban': ''
  });
  selectedAcctToDebitFX$ = this.selectedAcctToDebitFXSource.asObservable();
  private acctToDebitFXErrorSource = new BehaviorSubject<string>('Empty');
  acctToDebitFXError$ = this.acctToDebitFXErrorSource.asObservable();
  // End Observable string streams: Account to debitFX

  // Observable string sources: Pre registered Beneficiaries
  private preRegBeneficiaries = new BehaviorSubject<Beneficiaries[]>(null);
  preRegBeneficiaries$ = this.preRegBeneficiaries.asObservable();
  private selectedPreRegBeneficiaries = new BehaviorSubject<Beneficiaries>(null);
  selectedPreRegBeneficiaries$ = this.selectedPreRegBeneficiaries.asObservable();
  private preRegBeneficiariesError = new BehaviorSubject<string>('Empty');
  preRegBeneficiariesError$ = this.preRegBeneficiariesError.asObservable();
  // End Observable string sources: Pre registered Beneficiaries

  // Observable string sources: Pre registered Beneficiaries
  private beneficiaries = new BehaviorSubject<Beneficiaries[]>(null);
  beneficiaries$ = this.beneficiaries.asObservable();
  private selectedBeneficiary = new BehaviorSubject<Beneficiaries>(null);
  selectedBeneficiaries$ = this.selectedBeneficiary.asObservable();
  private beneficiariesError = new BehaviorSubject<string>('Empty');
  beneficiariesError$ = this.beneficiariesError.asObservable();
  // Observable string sources: Pre registered Beneficiaries

  // Observable string sources: Banks
  private banks = new BehaviorSubject<Banks[]>(null);
  banks$ = this.banks.asObservable();
  private selectedBank = new BehaviorSubject<Banks>(null);
  selectedBank$ = this.selectedBank.asObservable();
  private banksError = new BehaviorSubject<string>('Empty');
  banksError$ = this.banksError.asObservable();
  // End Observable string sources: Banks

  // Branches, You can subscribe to this Observable for a list of Bank Branches
  private branchesSource = new Subject<any[]>();
  branchesObserver = this.branchesSource.asObservable();

  // Observable string sources: Pre registered Beneficiaries
  private fxbeneficiaries = new BehaviorSubject<FxBeneficiaries[]>(null);
  fxbeneficiaries$ = this.fxbeneficiaries.asObservable();
  private fxselectedBeneficiary = new BehaviorSubject<FxBeneficiaries>(null);
  fxselectedBeneficiaries$ = this.fxselectedBeneficiary.asObservable();
  private fxbeneficiariesError = new BehaviorSubject<string>('Empty');
  fxbeneficiariesError$ = this.fxbeneficiariesError.asObservable();
  subscription: Subscription;

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private router: Router,
    private userService: UserService,
  ) { }


  // =================== BALANCE ENQUIRY =======================
  customerValidationUpdated(body): Observable<any> {
    const PATH = this.CUST_URL + `/CustomerValidationMoreRecord`;
    // Add customer related properties to the body object
    const cusNum = body.customerNumber;
    body = this.util.addAuthParams(body);
    delete body.customerID;
    body.customerNumber = cusNum;
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  getAcctDetailsData() {
    const body = {
      'email': '',
      'phoneNumber': '',
      'bvn': '',
      'category': 1,
      'customerNumber': this.userService.getUserDetails().userId
    };
    this.customerValidationUpdated(body).pipe(untilDestroyed(this))
      .subscribe(
        res => {
          console.log(res);
          console.log(res.accountDetails);
          if (res.responseCode === '00') {
            this.updateAcctDetailsError('');
            this.updateAcctDetails(res.accountDetails);
            this.updateSelectedAcctDetails(res.accountDetails[0]);
          } else {
            this.updateAcctDetailsError(res.responseDescription);
            this.updateAcctDetails(null);
            this.updateSelectedAcctDetails(null);
            // alert('An Error Occured' + res.responseDescription);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updateAcctDetailsError(`Oops! We couldn't reach this service at this time. Try again`);
          this.updateAcctDetails(null);
          this.updateSelectedAcctDetails(null);
        }
      );

  }

  updateAcctDetails(accts) {
    this.acctDetailSource.next(accts);
  }

  updateSelectedAcctDetails(selectedAcct) {
    this.selectedAcctDetailSource.next(selectedAcct);
  }

  updateAcctDetailsError(message) {
    this.acctDetailErrorSource.next(message);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
