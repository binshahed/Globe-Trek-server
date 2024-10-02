/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import PaymentModel from './payment.model';
import { UserModel } from '../auth/auth.model';


const successPayment = async (payload: any) => {
  const isPaymentExist = await PaymentModel.findOne({
    user: payload.user,
  });

  const user = await UserModel.findById(payload?.user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  await UserModel.findByIdAndUpdate(user, { subscriptions: 'premium' });

  if (isPaymentExist) {
    return { exists: true };
  }

  const payment = await PaymentModel.create(payload);
  if (!payment) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment is not created');
  }

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
