import moment from 'moment';
moment.locale('fa');

export interface DateRangeQuery {
  today?: string;
  yesterday?: string;
  last7Days?: string;
  last30Days?: string;
  lastYear?: string;
  startDate?: string;
  endDate?: string;
  month?: string;
}

export class DateRangeUtil {
  static getDateRangeFromQuery(query: DateRangeQuery): { startDate: string; endDate: string } {
    const {
      today,
      yesterday,
      last7Days,
      last30Days,
      lastYear,
      startDate: queryStartDate,
      endDate: queryEndDate,
      month,
    } = query;

    if (today) {
      return {
        startDate: moment().startOf('day').toISOString(),
        endDate: moment().endOf('day').toISOString(),
      };
    } else if (yesterday) {
      return {
        startDate: moment().subtract(1, 'days').startOf('day').toISOString(),
        endDate: moment().subtract(1, 'days').endOf('day').toISOString(),
      };
    } else if (last7Days) {
      return {
        startDate: moment().subtract(7, 'days').startOf('day').toISOString(),
        endDate: moment().endOf('day').toISOString(),
      };
    } else if (last30Days) {
      return {
        startDate: moment().subtract(30, 'days').startOf('day').toISOString(),
        endDate: moment().endOf('day').toISOString(),
      };
    } else if (lastYear) {
      return {
        startDate: moment().subtract(1, 'years').startOf('year').toISOString(),
        endDate: moment().endOf('year').toISOString(),
      };
    } else if (queryStartDate && queryEndDate) {
      return {
        startDate: moment(queryStartDate).startOf('day').toISOString(),
        endDate: moment(queryEndDate).endOf('day').toISOString(),
      };
    } else if (month) {
      return {
        startDate: moment().startOf('month').toISOString(),
        endDate: moment().endOf('month').toISOString(),
      };
    } else {
      return {
        startDate: moment().startOf('day').toISOString(),
        endDate: moment().endOf('day').toISOString(),
      };
    }
  }
}
