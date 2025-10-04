import { WorkingDayCalculator } from '../../src/services/calculator';

describe('Integration Tests - Basic Functionality', () => {
  it('should add 1 working day correctly', () => {
    // Monday 8 AM Colombia = Monday 1 PM UTC
    const startDate = new Date('2025-01-13T13:00:00.000Z');
    const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 1, 0);
    
    // Should be Tuesday 8 AM Colombia = Tuesday 1 PM UTC
    expect(result.toISOString()).toBe('2025-01-14T13:00:00.000Z');
  });

  it('should add 1 working hour correctly', () => {
    // Monday 8 AM Colombia = Monday 1 PM UTC
    const startDate = new Date('2025-01-13T13:00:00.000Z');
    const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 0, 1);
    
    // Should be Monday 9 AM Colombia = Monday 2 PM UTC
    expect(result.toISOString()).toBe('2025-01-13T14:00:00.000Z');
  });

  it('should handle 8 working hours in one day', () => {
    // Monday 8 AM Colombia = Monday 1 PM UTC
    const startDate = new Date('2025-01-13T13:00:00.000Z');
    const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 0, 8);
    
    // Should be Monday 5 PM Colombia = Monday 10 PM UTC
    expect(result.toISOString()).toBe('2025-01-13T22:00:00.000Z');
  });

  it('should skip lunch break when adding hours', () => {
    // Monday 11 AM Colombia = Monday 4 PM UTC
    const startDate = new Date('2025-01-13T16:00:00.000Z');
    const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 0, 2);
    
    // Should be Monday 2 PM Colombia = Monday 7 PM UTC (skipping lunch)
    expect(result.toISOString()).toBe('2025-01-13T19:00:00.000Z');
  });

  it('should normalize weekend to previous working day', () => {
    // Saturday 2 PM Colombia = Saturday 7 PM UTC
    const startDate = new Date('2025-01-11T19:00:00.000Z');
    const result = WorkingDayCalculator.calculateWorkingDateTime(startDate, 0, 1);
    
    // Should normalize to Friday 5 PM, then add 1 hour = Monday 9 AM
    expect(result.toISOString()).toBe('2025-01-13T14:00:00.000Z');
  });
});