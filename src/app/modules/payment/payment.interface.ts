import { ObjectId } from 'mongoose';

export type TPayment = {
  amount: number;
  booking: ObjectId;
  transactionId: ObjectId;
};
