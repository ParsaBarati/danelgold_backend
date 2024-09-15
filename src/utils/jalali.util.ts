import { Injectable } from '@nestjs/common';
import * as moment from 'jalali-moment';
import * as momentZone from 'moment-timezone';

@Injectable()
export class JalaliService {
  convertToJalaliDate(date: Date): string {
    moment.locale('fa');
    const persianMonthName = moment(date).format('MMMM');
    return moment(date).format(`jDD/${persianMonthName}/jYYYY`);
  }

  convertToTimeZone(date: Date): Date {
    const formattedDate = momentZone(date).tz('Asia/Tehran').format();
    return new Date(formattedDate);
  }
}
