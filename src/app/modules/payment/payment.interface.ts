import { ObjectId } from 'mongoose';

export type TPayment = {
  amount: number;
  transactionId: ObjectId;
  user: ObjectId;
};
