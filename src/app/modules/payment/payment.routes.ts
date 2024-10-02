import { Router } from 'express';

import { paymentController } from './payment.controller';

const router = Router();

router.route('/success').post(paymentController.successPayment);
// router.route('/failed').post(paymentController.failedPayment);
// router.route('/canceled').post(paymentController.canceledPayment);

export const paymentRouter = router;
