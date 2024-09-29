import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';

const router = Router();

router
  .route('/signup')
  .post(
    validateRequest(AuthValidation.createUserValidationSchema),
    authController.signupUser,
  );

router
  .route('/login')
  .post(
    validateRequest(AuthValidation.loginValidationSchema),
    authController.loginUser,
  );

router
  .route('/change-password')
  .post(
    auth('admin', 'user'),
    validateRequest(AuthValidation.changePasswordValidationSchema),
    authController.changePassword,
  );

router
  .route('/refresh-token')
  .post(
    validateRequest(AuthValidation.refreshTokenValidationSchema),
    authController.refreshToken,
  );

router
  .route('/reset-password')
  .post(
    auth(),
    validateRequest(AuthValidation.resetPasswordValidationSchema),
    authController.resetPassword,
  );

router
  .route('/forget-password')
  .post(
    validateRequest(AuthValidation.forgotPasswordValidationSchema),
    authController.forgotPassword,
  );

router
  .route('/me')
  .get(auth('admin', 'user'), authController.getUserProfile)
  .patch(auth('admin', 'user'), authController.updateUserProfile);

router
  .route('/follow')
  .patch(auth('admin', 'user'), authController.addFollower);

router
  .route('/unfollow')
  .patch(auth('admin', 'user'), authController.unfollowUser);

export const authRouter = router;
