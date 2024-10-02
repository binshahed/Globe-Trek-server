/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';

import AppError from '../../errors/AppError';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { paymentService } from './payment.service';
import path from 'path';
import catchAsync from '../../utils/catchAsync';

// create a new Review
const successPayment = catchAsync(async (req, res) => {
  const paymentInfoToken = req.query.secret as string;

  const token = jwt.verify(
    paymentInfoToken,
    config.paymentSignatureKey as string,
  );

  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid payment info token');
  }

  const { transactionId, user, amount } = token as {
    transactionId: string;
    user: string;
    amount: number;
  };

  const result = await paymentService.successPayment({
    transactionId,
    user,
    amount,
  });

  if (result.exists as boolean) {
    // Redirect to the specified URL if payment already exists
    return res.redirect(
      'https://car-wash-booking-system-client-opal.vercel.app/',
    );
  }

  const filePath = path.resolve(__dirname, '../../templates/success.html');

  if (!result.exists as boolean) {
    res.sendFile(filePath);
  }
});

// const failedPayment = catchAsync(async (req, res) => {
//   const paymentInfoToken = req.query.secret as string;
//   const token = jwt.verify(
//     paymentInfoToken,
//     config.paymentSignatureKey as string,
//   );

//   if (!token) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Invalid payment info token');
//   }

//   const { transactionId, booking, amount } = token as {
//     transactionId: string;
//     booking: string;
//     amount: number;
//   };

//   const result = await paymentService.failedPayment({
//     transactionId,
//     booking,
//     amount,
//   });

//   const filePath = path.resolve(__dirname, '../../templates/failed.html');

//   if (result) {
//     res.sendFile(filePath);
//   } else {
//     return res.redirect(
//       'https://car-wash-booking-system-client-opal.vercel.app/',
//     );
//   }
// });
// const canceledPayment = catchAsync(async (req, res) => {
//   const paymentInfoToken = req.query.secret as string;
//   const token = jwt.verify(
//     paymentInfoToken,
//     config.paymentSignatureKey as string,
//   );

//   if (!token) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Invalid payment info token');
//   }

//   const { transactionId, booking, amount } = token as {
//     transactionId: string;
//     booking: string;
//     amount: number;
//   };

//   const result = await paymentService.failedPayment({
//     transactionId,
//     booking,
//     amount,
//   });

//   const filePath = path.resolve(__dirname, '../../templates/canceled.html');

//   if (result) {
//     res.sendFile(filePath);
//   } else {
//     return res.redirect(
//       'https://car-wash-booking-system-client-opal.vercel.app/',
//     );
//   }
// });

export const paymentController = {
  successPayment,
  // failedPayment,
  // canceledPayment,
};
