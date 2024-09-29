import { Response } from 'express';

type TData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  token?: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TData<T>) => {
  res.status(data?.statusCode).send({
    success: true,
    statusCode: data.statusCode,
    message: data.message,
    token: data.token,
    data: data.data,
  });
};

export default sendResponse;
