import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { COLOMBIA_TIMEZONE, WORKING_DAYS } from '../constants';

export function utcToColombia(utcDate: Date): Date {
  return utcToZonedTime(utcDate, COLOMBIA_TIMEZONE);
}

export function colombiaToUtc(colombiaDate: Date): Date {
  return zonedTimeToUtc(colombiaDate, COLOMBIA_TIMEZONE);
}

export function isWorkingDay(date: Date): boolean {
  const day = date.getDay();
  return day >= WORKING_DAYS.MONDAY && day <= WORKING_DAYS.FRIDAY;
}