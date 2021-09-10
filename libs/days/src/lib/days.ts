const MILLIS_IN_HOUR = 60 * 60 * 1000;
const MILLIS_PER_DAY = MILLIS_IN_HOUR * 24;

export function today() {
   return daysAgo(0);
}

export function tomorrow() {
   return daysAgo(-1);
}

export function daysAgo(n: number) {
   return dateToDayString(new Date(new Date().getTime() - 8 * MILLIS_IN_HOUR - n * MILLIS_PER_DAY));
}

/**
 * Get the integral day within the epoch for the given day string in yyyy-mm-dd format
 * @param {String} yyyymmdd day date in yyyy-mm-dd format
 */
export function getDayNumber(yyyymmdd: string) {
   const results = /^(\d\d\d\d)-(\d\d)-(\d\d)$/.exec(yyyymmdd);
   if (!results) {
      throw new Error('bad day format ' + yyyymmdd);
   }
   const millis = Date.UTC(+results[1], +results[2]-1, +results[3], 12, 0, 0);
   return Math.floor(millis / MILLIS_PER_DAY); 
}

function pad2(n: number) {
   return n < 10 ? '0' + n : '' + n;
}

export function dateToDayString(date: Date|number) {
   if (!(date instanceof Date)) {
      date = new Date(date);
   }
   return date.getUTCFullYear() + '-' + pad2(date.getUTCMonth() + 1) + '-' + pad2(date.getUTCDate());
}

export function dayStringToDate(dayString: string) {
   const matches = dayString.match(/(\d{4})-(\d{2})-(\d{2})/);
   if (!matches) {
      return new Date();
   }
   return new Date(+matches[1], +matches[2]-1, +matches[3]);
}

export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


export function formatDateFancy(date: Date|string) {
   if (typeof date === 'string') {
      date = dayStringToDate(date);
   }
   return dayNames[date.getDay()] + ', ' + date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
}

// Like Math.min but works on day strings
export function firstDay(day1: string, day2: string) {
   return day1 < day2 ? day1 : day2;
}

export function isDayInYear(day: string, year: number) {
   return day.indexOf(year + '-') === 0;
}
