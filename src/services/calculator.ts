import { addDays, addMinutes } from 'date-fns';
import { utcToColombia, colombiaToUtc, isWorkingDay } from '../utils/timezone';
import { HolidayService } from './holiday';
import { WORKING_HOURS, TIME_CONSTANTS } from '../constants';

export class WorkingDayCalculator {
  
  static calculateWorkingDateTime(startDateUtc: Date, daysToAdd: number, hoursToAdd: number): Date {
    let currentDate = utcToColombia(startDateUtc);
    const originalDate = new Date(currentDate);
    
    // Normalize to previous working time first
    currentDate = this.normalizeToWorkingTime(currentDate);
    
    // Add working days first (preserving current time)
    currentDate = this.addWorkingDays(currentDate, daysToAdd);
    
    // Add working hours
    currentDate = this.addWorkingHours(currentDate, hoursToAdd, originalDate);
    
    return colombiaToUtc(currentDate);
  }

  private static addWorkingDays(startDate: Date, days: number): Date {
    if (days === 0) return startDate;
    
    let currentDate = new Date(startDate);
    
    // Add the specified number of working days
    for (let i = 0; i < days; i++) {
      do {
        currentDate = addDays(currentDate, 1);
      } while (!isWorkingDay(currentDate) || HolidayService.isHoliday(currentDate));
    }
    
    return currentDate;
  }

  private static addWorkingHours(startDate: Date, hours: number, originalDate: Date): Date {
    if (hours === 0) return startDate;
    
    let currentDate = new Date(startDate);
    let remainingMinutes = hours * TIME_CONSTANTS.MINUTES_PER_HOUR;
    
    // Only move to next working period if original was normalized (outside working time)
    const wasNormalized = this.wasDateNormalized(originalDate);
    if (wasNormalized) {
      currentDate = this.moveToNextWorkingPeriod(currentDate);
    }
    
    while (remainingMinutes > 0) {
      currentDate = this.ensureWorkingDay(currentDate);
      currentDate = this.normalizeToWorkingHours(currentDate);
      
      const availableMinutes = this.getAvailableMinutes(currentDate);
      const minutesToAdd = Math.min(remainingMinutes, availableMinutes);
      
      currentDate = addMinutes(currentDate, minutesToAdd);
      remainingMinutes -= minutesToAdd;
      
      if (remainingMinutes > 0) {
        currentDate = this.handleTimeTransition(currentDate);
      }
    }
    
    return currentDate;
  }

  private static ensureWorkingDay(date: Date): Date {
    let currentDate = new Date(date);
    while (!isWorkingDay(currentDate) || HolidayService.isHoliday(currentDate)) {
      currentDate = addDays(currentDate, 1);
      currentDate = this.setTimeOnDate(currentDate, WORKING_HOURS.START);
    }
    return currentDate;
  }

  private static setTimeOnDate(date: Date, hour: number, minute = 0): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0);
  }

  private static normalizeToWorkingHours(date: Date): Date {
    const hour = date.getHours();
    
    if (hour < WORKING_HOURS.START) {
      return this.setTimeOnDate(date, WORKING_HOURS.START);
    }
    
    if (hour === WORKING_HOURS.LUNCH_START) {
      return this.setTimeOnDate(date, WORKING_HOURS.LUNCH_END);
    }
    
    return date;
  }

  private static getAvailableMinutes(date: Date): number {
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    if (hour >= WORKING_HOURS.END) return 0;
    
    // During lunch break - no available minutes
    if (hour >= WORKING_HOURS.LUNCH_START && hour < WORKING_HOURS.LUNCH_END) {
      return 0;
    }
    
    if (hour < WORKING_HOURS.LUNCH_START) {
      // Morning: current time to lunch start
      return (WORKING_HOURS.LUNCH_START * TIME_CONSTANTS.MINUTES_PER_HOUR) - (hour * TIME_CONSTANTS.MINUTES_PER_HOUR + minute);
    } else {
      // Afternoon: current time to work end
      return (WORKING_HOURS.END * TIME_CONSTANTS.MINUTES_PER_HOUR) - (hour * TIME_CONSTANTS.MINUTES_PER_HOUR + minute);
    }
  }

  private static normalizeToWorkingDay(date: Date): Date {
    let currentDate = new Date(date);
    
    // If weekend or holiday, go to previous working day at same time
    while (!isWorkingDay(currentDate) || HolidayService.isHoliday(currentDate)) {
      currentDate = addDays(currentDate, -1);
    }
    
    return currentDate;
  }

  private static normalizeToWorkingTime(date: Date): Date {
    let currentDate = this.normalizeToWorkingDay(date);
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    
    // If weekend or holiday, go to previous working day at 5 PM
    if (!isWorkingDay(currentDate) || HolidayService.isHoliday(currentDate)) {
      while (!isWorkingDay(currentDate) || HolidayService.isHoliday(currentDate)) {
        currentDate = addDays(currentDate, -1);
      }
      return this.setTimeOnDate(currentDate, WORKING_HOURS.END);
    }
    
    // If before work hours, go to previous working day at 5 PM
    if (hour < WORKING_HOURS.START) {
      do {
        currentDate = addDays(currentDate, -1);
      } while (!isWorkingDay(currentDate) || HolidayService.isHoliday(currentDate));
      return this.setTimeOnDate(currentDate, WORKING_HOURS.END);
    }
    
    // If after work hours, set to 5 PM same day
    if (hour >= WORKING_HOURS.END) {
      return this.setTimeOnDate(currentDate, WORKING_HOURS.END);
    }
    
    // If during lunch break, normalize to 12:00 PM (start of lunch)
    if (hour === WORKING_HOURS.LUNCH_START && minute > 0) {
      return this.setTimeOnDate(currentDate, WORKING_HOURS.LUNCH_START);
    }
    
    return currentDate;
  }

  private static wasDateNormalized(originalDate: Date): boolean {
    const originalDay = originalDate.getDay();
    const originalHour = originalDate.getHours();
    
    // Check if original was outside working time
    const wasWeekend = originalDay === 0 || originalDay === 6;
    const wasHoliday = HolidayService.isHoliday(originalDate);
    const wasOutsideHours = originalHour < WORKING_HOURS.START || originalHour >= WORKING_HOURS.END;
    
    return wasWeekend || wasHoliday || wasOutsideHours;
  }

  private static moveToNextWorkingPeriod(date: Date): Date {
    // Move to next working day at 8 AM after normalization
    let nextDay = addDays(date, 1);
    while (!isWorkingDay(nextDay) || HolidayService.isHoliday(nextDay)) {
      nextDay = addDays(nextDay, 1);
    }
    return this.setTimeOnDate(nextDay, WORKING_HOURS.START);
  }

  private static handleTimeTransition(date: Date): Date {
    const hour = date.getHours();
    
    if (hour === WORKING_HOURS.LUNCH_START) {
      // Hit lunch - skip to lunch end
      return this.setTimeOnDate(date, WORKING_HOURS.LUNCH_END);
    }
    
    if (hour >= WORKING_HOURS.END) {
      // Hit end of day - move to next working day at 8 AM
      const nextDay = addDays(date, 1);
      return this.setTimeOnDate(nextDay, WORKING_HOURS.START);
    }
    
    return date;
  }
}