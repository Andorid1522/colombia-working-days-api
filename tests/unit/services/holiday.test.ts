import { HolidayService } from '../../../src/services/holiday';

describe('HolidayService', () => {


  it('should correctly identify known holidays', () => {
    expect(HolidayService.isHoliday(new Date('2025-01-01T10:00:00'))).toBe(true); // New Year
    expect(HolidayService.isHoliday(new Date('2025-12-25T10:00:00'))).toBe(true); // Christmas
    expect(HolidayService.isHoliday(new Date('2034-04-06T10:00:00'))).toBe(true); // Holy Thursday 2034
    expect(HolidayService.isHoliday(new Date('2035-03-22T10:00:00'))).toBe(true); // Holy Thursday 2035
    expect(HolidayService.isHoliday(new Date('2025-06-15T10:00:00'))).toBe(false); // Not a holiday
  });

  it('should consistently identify holidays across multiple calls', () => {
    const date = new Date('2025-01-01T10:00:00');
    
    // Multiple calls should return consistent results
    expect(HolidayService.isHoliday(date)).toBe(true);
    expect(HolidayService.isHoliday(date)).toBe(true);
    expect(HolidayService.isHoliday(new Date('2025-01-01T15:00:00'))).toBe(true);
  });

  it('should correctly identify holidays', () => {
    const isNewYear = HolidayService.isHoliday(new Date('2025-01-01T10:00:00'));
    const isChristmas = HolidayService.isHoliday(new Date('2025-12-25T15:00:00'));
    const isRegularDay = HolidayService.isHoliday(new Date('2025-01-15T10:00:00'));
    
    expect(isNewYear).toBe(true);
    expect(isChristmas).toBe(true);
    expect(isRegularDay).toBe(false);
  });


});