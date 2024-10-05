import { Router } from 'express';

import { paymentController } from './payment.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.route('/success').post(paymentController.successPayment);
router
  .route('/getPaymentDetails')
  .get(auth('admin', 'user'), paymentController.getPaymentDetails);
// router.route('/failed').post(paymentController.failedPayment);
// router.route('/canceled').post(paymentController.canceledPayment);

export const paymentRouter = router;
