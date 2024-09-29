/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  TErrorSource,
  TGenericErrorResponse,
} from '../interface/error.interface';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Define the regex pattern to match the department name
  const regex = /\{([^}]+)\}/;

  // Use the match method to extract the department name
  const match = err.message.match(regex);

  // Check if the match is found and extract the department name
  const errorName = match ? match[1] : null;
  const errorSource: TErrorSource = [
    {
      path: '',
      message: `${errorName} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: err.message,
    errorSource,
  };
};

export default handleDuplicateError;
