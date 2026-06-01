import {Pipe, PipeTransform} from '@angular/core';
import {GeneralUtilService} from "@shared/services/general-util.service";

@Pipe({
  name: 'dateTimeFormaterPipe',
  pure: true
})
export class DateTimeFormaterPipe implements PipeTransform {

  transform(value: string): any {
    if (!value) return '';

    const [date, time] = value.split('T');
    const reversedDate = GeneralUtilService.dateStringToDate(date);
    return `${reversedDate} ${time}`;
  }
}
