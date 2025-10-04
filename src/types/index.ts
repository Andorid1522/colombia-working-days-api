export interface ParsedParams {
  /** Number of working days to add (non-negative integer) */
  days: number;
  /** Number of working hours to add (non-negative integer) */
  hours: number;
  startDate: Date;
}

export interface ApiSuccessResponse {
  date: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}