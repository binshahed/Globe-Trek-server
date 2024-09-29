import { CastError } from 'mongoose';
import { TGenericErrorResponse } from '../interface/error.interface';

const handleCastError = (err: CastError): TGenericErrorResponse => {
  const statusCode = 400;

  return {
    statusCode,
    message: 'Cast error',
    errorSource: [
      {
        path: err.path,
        message: err.message,
      },
    ],
  };
};

export default handleCastError;
