import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const passwordValidators: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return control.value.startsWith('p')
    ? {startsWith: 'password do not has first letter to uppercase'}
    : null;
}

export function passwordWithParamsValidators(params: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value.startsWith('p')
      ? {startsWithParam: {message: `password ${params} do not has first letter to uppercase`}}
      : null;
  }
}
