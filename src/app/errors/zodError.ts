import { ZodError, ZodIssue } from 'zod';
import {
  TErrorSource,
  TGenericErrorResponse,
} from '../interface/error.interface';

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSource: TErrorSource = err.issues.map((issue: ZodIssue) => ({
    path: issue?.path[issue.path.length - 1].toString(),
    message: issue?.message,
  }));

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation error',
    errorSource,
  };
};
