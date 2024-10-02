/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { generateRandom20DigitString } from '../../utils/generateRandomId';

// const liveUrl: string = 'http://localhost:5000';
const liveUrl: string = 'https://globe-trek-server.vercel.app';

export const paymentResponse = async (
  payloadUser: any,

  amount: number,
) => {
  const tranId = generateRandom20DigitString();

  const token = jwt.sign(
    { transactionId: tranId, amount, user: payloadUser?._id },
    config.paymentSignatureKey as string,
    { expiresIn: '1h' },
  );

  const formData = {
    cus_name: payloadUser?.name,
    cus_email: payloadUser?.email,
    cus_phone: payloadUser?.phone,
    amount: amount,
    tran_id: tranId,
    signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
    store_id: 'aamarpaytest', // Ensure this is correct
    currency: 'BDT',
    desc: 'N/A',
    cus_add1: '53, Gausul Azam Road, Sector-14, Dhaka, Bangladesh',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    success_url: `${liveUrl}/api/payment/success?secret=${token}`,
    fail_url: `${liveUrl}/api/payment/failed?secret=${token}`,
    cancel_url: `${liveUrl}/api/payment/canceled?secret=${token}`,
    type: 'json',
  };

  // Send payment request to Aamarpay
  const { data: paymentResponse } = await axios.post(
    'https://sandbox.aamarpay.com/jsonpost.php',
    JSON.stringify(formData), // Use URLSearchParams to format the data correctly
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  );

  if (!paymentResponse?.result) {
    throw new AppError(httpStatus.PAYMENT_REQUIRED, 'Payment failed');
  }

  return paymentResponse;
};
