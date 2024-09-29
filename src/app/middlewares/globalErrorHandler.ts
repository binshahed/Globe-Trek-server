/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';

import AppError from '../errors/AppError';
import { handleZodError } from '../errors/zodError';
import handleValidationError from '../errors/validationError';
import { TErrorSource } from '../interface/error.interface';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import NotFoundError from '../errors/NotFoundError';
import AuthorizationError from '../errors/AuthorizationError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //setting default values
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  // checking zod error
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSource;
  }
  // checking validation error
  else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSource;
  }
  // checking cast error
  else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSource;
  }
  // checking duplicate error
  else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSource;
  }
  // custom error method
  else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }
  // custom not found error method
  else if (err instanceof NotFoundError) {
    statusCode = err.statusCode || 404;
    message = err.message || 'No Data Found';

    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      data: err.data || [],
    });
  } else if (err instanceof AuthorizationError) {
    statusCode = err.statusCode || 401;
    message = err.message || 'No Data Found';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
  // base error method
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.nodeEnv === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
