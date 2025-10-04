import { Request, Response } from 'express';
import { ApiSuccessResponse, ApiErrorResponse } from '../types';
import { validateAndParseParams, ValidationError } from '../utils/validation';
import { WorkingDayCalculator } from '../services/calculator';

export function calculateWorkingDays(req: Request, res: Response): void {
  try {
    const query = req.query;
    const { days, hours, startDate } = validateAndParseParams(query);
    
    const resultDate = WorkingDayCalculator.calculateWorkingDateTime(
      startDate,
      days,
      hours
    );
    
    const response: ApiSuccessResponse = {
      date: resultDate.toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    let errorResponse: ApiErrorResponse;
    
    if (error instanceof ValidationError) {
      errorResponse = {
        error: 'InvalidParameters',
        message: error.message
      };
      res.status(400).json(errorResponse);
    } else {
      errorResponse = {
        error: 'InternalServerError',
        message: 'An unexpected error occurred'
      };
      res.status(500).json(errorResponse);
    }
  }
}