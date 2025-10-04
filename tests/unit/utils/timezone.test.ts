import { utcToColombia, colombiaToUtc, isWorkingDay } from '../../../src/utils/timezone';

describe('timezone utilities', () => {
  describe('isWorkingDay', () => {
    it('should return true for weekdays', () => {
      // Monday
      expect(isWorkingDay(new Date('2025-01-13T10:00:00'))).toBe(true);
      // Tuesday
      expect(isWorkingDay(new Date('2025-01-14T10:00:00'))).toBe(true);
      // Wednesday
      expect(isWorkingDay(new Date('2025-01-15T10:00:00'))).toBe(true);
      // Thursday
      expect(isWorkingDay(new Date('2025-01-16T10:00:00'))).toBe(true);
      // Friday
      expect(isWorkingDay(new Date('2025-01-17T10:00:00'))).toBe(true);
    });

    it('should return false for weekends', () => {
      // Saturday
      expect(isWorkingDay(new Date('2025-01-18T10:00:00'))).toBe(false);
      // Sunday
      expect(isWorkingDay(new Date('2025-01-19T10:00:00'))).toBe(false);
    });
  });

  describe('timezone conversion', () => {
    it('should convert UTC to Colombia timezone', () => {
      const utcDate = new Date('2025-01-15T18:00:00.000Z');
      const colombiaDate = utcToColombia(utcDate);
      expect(colombiaDate.getHours()).toBe(13); // UTC-5
    });

    it('should convert Colombia to UTC timezone', () => {
      const colombiaDate = new Date('2025-01-15T13:00:00');
      const utcDate = colombiaToUtc(colombiaDate);
      expect(utcDate.toISOString()).toBe('2025-01-15T18:00:00.000Z');
    });
  });
});