import mongoose, { Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const PaymentSchema: Schema = new Schema<TPayment>(
  {
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },

    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  },
  { timestamps: true },
);

const PaymentModel = mongoose.model('Payment', PaymentSchema);

export default PaymentModel;
