import { ParsedParams } from '../types';

const ISO8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
const MAX_DAYS = 365;
const MAX_HOURS = 2000;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateAndParseParams(query: unknown): ParsedParams {
  if (!query || typeof query !== 'object') {
    throw new ValidationError('Invalid query parameters');
  }
  
  const params = query as Record<string, unknown>;
  const days = typeof params.days === 'string' ? params.days : undefined;
  const hours = typeof params.hours === 'string' ? params.hours : undefined;
  const date = typeof params.date === 'string' ? params.date : undefined;

  if ((days === undefined || days === '') && (hours === undefined || hours === '')) {
    throw new ValidationError('At least one parameter (days or hours) is required');
  }

  const parsedDays = days ? parseInt(days, 10) : 0;
  const parsedHours = hours ? parseInt(hours, 10) : 0;

  if (days && (isNaN(parsedDays) || parsedDays < 0 || parsedDays > MAX_DAYS)) {
    throw new ValidationError(`Days must be a positive integer between 0 and ${MAX_DAYS}`);
  }

  if (hours && (isNaN(parsedHours) || parsedHours < 0 || parsedHours > MAX_HOURS)) {
    throw new ValidationError(`Hours must be a positive integer between 0 and ${MAX_HOURS}`);
  }

  let startDate: Date;
  if (date) {
    if (!ISO8601_REGEX.test(date)) {
      throw new ValidationError('Date must be in ISO 8601 format with Z suffix');
    }
    startDate = new Date(date);
    if (isNaN(startDate.getTime())) {
      throw new ValidationError('Invalid date format');
    }
  } else {
    startDate = new Date();
  }

  return {
    days: parsedDays,
    hours: parsedHours,
    startDate
  };
}