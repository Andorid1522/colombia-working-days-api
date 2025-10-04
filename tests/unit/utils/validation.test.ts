import { validateAndParseParams, ValidationError } from '../../../src/utils/validation';

describe('validateAndParseParams', () => {
  it('should parse valid days parameter', () => {
    const result = validateAndParseParams({ days: '5' });
    expect(result.days).toBe(5);
    expect(result.hours).toBe(0);
  });

  it('should parse valid hours parameter', () => {
    const result = validateAndParseParams({ hours: '8' });
    expect(result.days).toBe(0);
    expect(result.hours).toBe(8);
  });

  it('should parse both days and hours', () => {
    const result = validateAndParseParams({ days: '2', hours: '4' });
    expect(result.days).toBe(2);
    expect(result.hours).toBe(4);
  });

  it('should parse valid date parameter', () => {
    const dateStr = '2025-01-15T10:00:00.000Z';
    const result = validateAndParseParams({ days: '1', date: dateStr });
    expect(result.startDate.toISOString()).toBe(dateStr);
  });

  it('should use current date when no date provided', () => {
    const before = new Date();
    const result = validateAndParseParams({ days: '1' });
    const after = new Date();
    
    expect(result.startDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(result.startDate.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should throw error when no parameters provided', () => {
    expect(() => validateAndParseParams({})).toThrow(ValidationError);
    expect(() => validateAndParseParams({})).toThrow('At least one parameter');
  });

  it('should throw error for invalid days', () => {
    expect(() => validateAndParseParams({ days: 'invalid' })).toThrow(ValidationError);
    expect(() => validateAndParseParams({ days: '-1' })).toThrow(ValidationError);
  });

  it('should throw error for invalid hours', () => {
    expect(() => validateAndParseParams({ hours: 'invalid' })).toThrow(ValidationError);
    expect(() => validateAndParseParams({ hours: '-1' })).toThrow(ValidationError);
  });

  it('should throw error for invalid date format', () => {
    expect(() => validateAndParseParams({ days: '1', date: '2025-01-15' })).toThrow(ValidationError);
    expect(() => validateAndParseParams({ days: '1', date: '2025-01-15T10:00:00' })).toThrow(ValidationError);
    expect(() => validateAndParseParams({ days: '1', date: 'invalid-date' })).toThrow(ValidationError);
  });

  it('should throw error for days exceeding maximum limit', () => {
    expect(() => validateAndParseParams({ days: '366' })).toThrow(ValidationError);
    expect(() => validateAndParseParams({ days: '366' })).toThrow('Days must be a positive integer between 0 and 365');
  });

  it('should throw error for hours exceeding maximum limit', () => {
    expect(() => validateAndParseParams({ hours: '2001' })).toThrow(ValidationError);
    expect(() => validateAndParseParams({ hours: '2001' })).toThrow('Hours must be a positive integer between 0 and 2000');
  });
});