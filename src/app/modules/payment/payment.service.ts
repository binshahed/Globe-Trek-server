/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import PaymentModel from './payment.model';
import { UserModel } from '../auth/auth.model';

const successPayment = async (payLoad: any) => {
  const isPaymentExist = await PaymentModel.findOne({
    booking: payLoad.booking,
  });

  if (isPaymentExist) {
    return { exists: true };
  }

  const payment = await PaymentModel.create(payLoad);
  if (!payment) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment is not created');
  }

  // const updateUser = await UserModel.

  return { exists: false };
};

// const failedPayment = async (payLoad: any) => {
//   const booking = await BookingModel.findById(payLoad.booking);

//   await SlotModel.findByIdAndUpdate(
//     booking?.slot,
//     { isBooked: 'available' },
//     {
//       new: true,
//     },
//   );

//   await BookingModel.findOneAndDelete(payLoad.booking);

//   return true;
// };

export const paymentService = {
  successPayment,
  // failedPayment,
};
