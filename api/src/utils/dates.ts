import * as moment from 'moment';

export const dateToString = (date: Date): string =>
  moment.utc(date).format('MMMM Do YYYY, h:mm:ss a');
