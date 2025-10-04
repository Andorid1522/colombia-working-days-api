import { WorkingDayCalculator } from '../../../src/services/calculator';
import { HolidayService } from '../../../src/services/holiday';

describe('Holiday Integration Tests', () => {
  it('should skip consecutive holidays (Holy Week 2025-04-17 and 2025-04-18)', () => {
    const startDate = new Date('2025-04-16T13:00:00.000Z');
    const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 1, 0);
    expect(result.toISOString()).toBe('2025-04-21T13:00:00.000Z');
  });

  it('should handle multiple working days across holidays', () => {
    const startDate = new Date('2025-04-15T13:00:00.000Z');
    const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 5, 0);
    expect(result.toISOString()).toBe('2025-04-24T13:00:00.000Z');
  });

  it('should verify key Colombian holidays are recognized', () => {
    expect(HolidayService.isHoliday(new Date('2025-01-01T10:00:00'))).toBe(true);
    expect(HolidayService.isHoliday(new Date('2025-04-17T10:00:00'))).toBe(true);
    expect(HolidayService.isHoliday(new Date('2025-04-18T10:00:00'))).toBe(true);
    expect(HolidayService.isHoliday(new Date('2025-12-25T10:00:00'))).toBe(true);
  });
});