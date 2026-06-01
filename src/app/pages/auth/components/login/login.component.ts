import {Component, OnInit, inject, ChangeDetectionStrategy} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { markFormGroupTouched, regexErrors } from 'src/app/shared/utils';

import {Observable} from "rxjs";
import {CommonModule} from "@angular/common";
import {AuthTokenStorageService} from "@core/services/auth-token-storage.service";
import {FormFieldComponent} from "@shared/components/controls/form-field/form-field.component";
import {TranslateModule} from "@ngx-translate/core";
import {BasicInputComponent} from "@shared/components/controls/basic-input/basic-input.component";
import {PasswordInputComponent} from "@shared/components/controls/password-input/password-input.component";
import {ButtonComponent} from "@shared/components/button/button.component";
import {AuthStateService} from "@pages/auth/services/auth-state.service";

@Component({
  selector: 'app-login',
  providers: [AuthTokenStorageService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormFieldComponent,
    BasicInputComponent,
    PasswordInputComponent,
    ButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup
  public isInline: boolean = false;
  public regexErrors = regexErrors
  public loading$: Observable<boolean | null> | undefined;
  public loadingError$: Observable<string | null> | undefined;

  private readonly fb = inject(FormBuilder);
  private readonly authStateService = inject(AuthStateService);

  ngOnInit(): void {
    this.loading$ = this.authStateService.loading$;
    this.authStateService.init().subscribe();

    this.loginForm = this.fb.group({
        username: [null, {
            validators: [
              Validators.required,
              Validators.minLength(3),
              //passwordValidators,
              //passwordWithParamsValidators('secret')
            ]
        }],
        password: [null, {
          validators: [
            Validators.required,
            Validators.minLength(3),
            //passwordWithParamsValidators('secret')
          ]
        }]
    })
  }

  login(): void {
    if (!this.loginForm.valid) {
      this.loadingError$ = this.authStateService.error$;
      markFormGroupTouched(this.loginForm);
      return;
    }

    this.authStateService.login(this.loginForm.value).subscribe();

  }
}
