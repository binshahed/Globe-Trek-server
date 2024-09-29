import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import { JwtPayload } from 'jsonwebtoken';

import { UserModel } from './auth.model';
import {
  TPasswordChange,
  TUserLogin,
  TUserSignUp,
} from './auth.interface';
import { sendEmail } from '../../utils/sendEmail';

const signupUser = async (payload: TUserSignUp) => {
  // Check if user already exists by email
  const existingUser = await UserModel.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'Email is already registered');
  }

  // Hash the password before saving the user
  const hashedPassword = await UserModel.hashPassword(payload.password);

  // Create new user
  const newUser = await UserModel.create({
    email: payload.email,
    name: payload.name,
    password: hashedPassword,
    phone: payload.phone,
    address: payload.address,
    role: 'user', // Default role is 'user'
  });

  // Generate access token
  const accessToken = createToken(
    {
      _id: newUser._id as string,
      name: newUser.name as string,
      email: newUser.email as string,
      address: newUser.address as string,
      phone: newUser.phone as string,
      role: newUser.role as string,
    },
    config.jwtAccessSecretKey as string,
    config.jwtAccessExpiresIn as string,
  );

  // Generate refresh token
  const refreshToken = createToken(
    {
      _id: newUser._id as string,
      name: newUser.name as string,
      email: newUser.email as string,
      address: newUser.address as string,
      phone: newUser.phone as string,
      role: newUser.role as string,
    },
    config.jwtRefreshSecretKey as string,
    config.jwtRefreshExpiresIn as string,
  );

  return {
    accessToken,
    refreshToken,
    user: newUser, // Optionally return the new user data
  };
};

const loginUser = async (payload: TUserLogin) => {
  // check if user exists

  const user = await UserModel.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'Email or password not matched');
  }

  // check if password is incorrect
  if (
    !(await UserModel.isPasswordMatched(
      payload.password,
      user.password as string,
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Email or password not matched');
  }

  // Ensure jwtSecret is defined

  //   generate access token
  const accessToken = createToken(
    {
      _id: user._id as string,
      name: user.name as string,
      email: user.email as string,
      address: user.address as string,
      phone: user.phone as string,
      role: user.role as string,
    },
    config.jwtAccessSecretKey as string,
    config.jwtAccessExpiresIn as string,
  );

  //   generate refresh token
  const refreshToken = createToken(
    {
      _id: user._id as string,
      name: user.name as string,
      email: user.email as string,
      address: user.address as string,
      phone: user.phone as string,
      role: user.role as string,
    },
    config.jwtRefreshSecretKey as string,
    config.jwtRefreshExpiresIn as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (user: JwtPayload, payload: TPasswordChange) => {
  // check if old password is correct

  const email = user.email;
  const userRole = user.role;

  const fullUserData = await UserModel.isUserExistsByEmail(email);

  const isPasswordCorrect = await UserModel.isPasswordMatched(
    payload.oldPassword,
    fullUserData.password as string,
  );

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password is incorrect');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.saltRound),
  );

  await UserModel.findOneAndUpdate(
    { email, role: userRole },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
    { upsert: true },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // Check if the token is provided by the client

  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  // Verify the access token and decode the payload
  const decodedToken = verifyToken(token, config.jwtRefreshSecretKey as string);
  const { role, _id, name, email, address,phone } = decodedToken.data;
  const { iat } = decodedToken;

  // Fetch the user's full data using the id from the token
  const user = await UserModel.findById(_id);

  // check if the user is exist
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'The user does not exist');
  }

  // check if password change invalidated token
  if (
    user.passwordChangeAt &&
    UserModel.isJwtIssuedBeforePasswordChanged(
      user.passwordChangeAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This user is unauthorized!');
  }

  //   generate access token
  const accessToken = createToken(
    {
      _id: _id as string,
      name: name as string,
      email: email as string,
      address: address as string,
      phone: phone as string,
      role: role as string,
    },
    config.jwtAccessSecretKey as string,
    config.jwtAccessExpiresIn as string,
  );

  return {
    accessToken,
  };
};

const forgotPassword = async (email: string) => {
  // Fetch the user's full data using the id from the token
  const user = await UserModel.isUserExistsByEmail(email);

  // check if the user is exist
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'The user does not exist');
  }

  //   generate access token
  const accessToken = createToken(
    {
      _id: user._id as string,
      name: user.name as string,
      email: user.email as string,
      address: user.address as string,
      phone: user.phone as string,
      role: user.role as string,
    },
    config.jwtAccessSecretKey as string,
    '10m',
  );

  if (!accessToken) {
    throw new AppError(httpStatus.FORBIDDEN, 'Something went wrong');
  }

  const resetUiLink = `${config?.clientUrl}?id=${user._id}&token=${accessToken}`;

  sendEmail(user.email, resetUiLink);

  return 'Please Check your email to reset your password';
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // check if old password is correct

  const user = await UserModel.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  // Verify the access token and decode the payload
  const decodedToken = verifyToken(token, config.jwtAccessSecretKey as string);

  if (!decodedToken) {
    throw new AppError(httpStatus.FORBIDDEN, 'Token is not Valid');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.saltRound),
  );

  await UserModel.findOneAndUpdate(
    { email: payload.email },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
    { upsert: true },
  );

  return null;
};

export const authService = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
  signupUser,
};
