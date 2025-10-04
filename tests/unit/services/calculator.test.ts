import { WorkingDayCalculator } from '../../../src/services/calculator';

describe('WorkingDayCalculator', () => {
  describe('Example test cases from requirements', () => {
    it('Example 1: Friday 5 PM + 1 hour should be Monday 9 AM', () => {
      // Friday 5 PM Colombia = Friday 10 PM UTC
      const startDate = new Date('2025-01-10T22:00:00.000Z');
      const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 0, 1);
      
      // Should be Monday 9 AM Colombia = Monday 2 PM UTC
      expect(result.toISOString()).toBe('2025-01-13T14:00:00.000Z');
    });

    it('Example 2: Saturday 2 PM + 1 hour should be Monday 9 AM', () => {
      // Saturday 2 PM Colombia = Saturday 7 PM UTC
      const startDate = new Date('2025-01-11T19:00:00.000Z');
      const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 0, 1);
      
      // Should normalize to Friday 5 PM, then add 1 hour = Monday 9 AM
      expect(result.toISOString()).toBe('2025-01-13T14:00:00.000Z');
    });

    it('Example 5: Working day 8 AM + 8 hours should be same day 5 PM', () => {
      // Monday 8 AM Colombia = Monday 1 PM UTC
      const startDate = new Date('2025-01-13T13:00:00.000Z');
      const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 0, 8);
      
      // Should be Monday 5 PM Colombia = Monday 10 PM UTC
      expect(result.toISOString()).toBe('2025-01-13T22:00:00.000Z');
    });

    it('Example 6: Working day 8 AM + 1 day should be next working day 8 AM', () => {
      // Monday 8 AM Colombia = Monday 1 PM UTC
      const startDate = new Date('2025-01-13T13:00:00.000Z');
      const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 1, 0);
      
      // Should be Tuesday 8 AM Colombia = Tuesday 1 PM UTC
      expect(result.toISOString()).toBe('2025-01-14T13:00:00.000Z');
    });
  });

  describe('Working hours calculation', () => {
    it('should handle lunch break correctly', () => {
      // Monday 11:30 AM Colombia = Monday 4:30 PM UTC
      const startDate = new Date('2025-01-13T16:30:00.000Z');
      const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 0, 2);
      
      // Should skip lunch: 11:30 + 30min = 12:00 (lunch), skip to 13:00, + 1.5h = 14:30
      expect(result.toISOString()).toBe('2025-01-13T19:30:00.000Z');
    });

    it('should handle multiple days with hours', () => {
      // Tuesday 3 PM Colombia = Tuesday 8 PM UTC
      const startDate = new Date('2025-01-14T20:00:00.000Z');
      const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 1, 4);
      
      // Should be Thursday 10 AM Colombia = Thursday 3 PM UTC
      expect(result.toISOString()).toBe('2025-01-16T15:00:00.000Z');
    });
  });

  describe('Weekend and holiday handling', () => {
    it('should skip weekends when adding days', () => {
      // Friday 8 AM Colombia = Friday 1 PM UTC
      const startDate = new Date('2025-01-10T13:00:00.000Z');
      const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 1, 0);
      
      // Should skip weekend and go to Monday
      expect(result.toISOString()).toBe('2025-01-13T13:00:00.000Z');
    });

    it('should normalize weekend start time to previous working day', () => {
      // Saturday 10 AM Colombia = Saturday 3 PM UTC
      const startDate = new Date('2025-01-11T15:00:00.000Z');
      const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 1, 0);
      
      // Should normalize to Friday 10 AM, then add 1 day = Monday 10 AM
      expect(result.toISOString()).toBe('2025-01-13T15:00:00.000Z');
    });
  });

  describe('Edge cases', () => {
    it('should handle time before work hours', () => {
      // Tuesday 6 AM Colombia = Tuesday 11 AM UTC
      const startDate = new Date('2025-01-14T11:00:00.000Z');
      const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 0, 1);
      
      // Should normalize to Monday 5 PM, then add 1 hour = Tuesday 9 AM
      expect(result.toISOString()).toBe('2025-01-14T14:00:00.000Z');
    });

    it('should handle time during work hours (Example 8 corrected)', () => {
      // Tuesday 11:30 AM Colombia = Tuesday 4:30 PM UTC
      const startDate = new Date('2025-01-14T16:30:00.000Z');
      const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 0, 3);
      
      // Should be Tuesday 3:30 PM Colombia = Tuesday 8:30 PM UTC (skipping lunch)
      expect(result.toISOString()).toBe('2025-01-14T20:30:00.000Z');
    });
  });
});