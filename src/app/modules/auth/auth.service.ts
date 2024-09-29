/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import { JwtPayload } from 'jsonwebtoken';

import { UserModel } from './auth.model';
import {
  TPasswordChange,
  TSubscriptions,
  TUser,
  TUserLogin,
  TUserSignUp,
} from './auth.interface';
import { sendEmail } from '../../utils/sendEmail';

import mongoose from 'mongoose';

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
      subscriptions: newUser.subscriptions as TSubscriptions,
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
      subscriptions: newUser.subscriptions as TSubscriptions,
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
      subscriptions: user.subscriptions as TSubscriptions,
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
      subscriptions: user.subscriptions as TSubscriptions,
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
  const decodedData = decodedToken.data;
  const { iat } = decodedToken;

  // Fetch the user's full data using the id from the token
  const user = await UserModel.findById(decodedData?._id);

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
    decodedData,
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
      subscriptions: user.subscriptions as TSubscriptions,
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

const getUserProfile = async (user: TUser) => {
  // Fetch the user's full data using the id from the token
  const profile = await UserModel.findById(user?._id).populate(['followers']);

  // check if the user is exist
  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, 'The user does not exist');
  }

  return profile;
};

const updateUserProfile = async (user: TUser, payload: any) => {
  payload.followers = [new mongoose.Types.ObjectId('66f93c27b43304ccbf9aca7e')];

  const updatedUser = await UserModel.findByIdAndUpdate(user._id, payload, {
    new: true,
  });

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'The user does not exist');
  }

  return updatedUser;
};

const addFollower = async (user: TUser, followerId: string) => {
  // Trim the followerId to remove any leading/trailing spaces
  const trimmedFollowerId = followerId.trim();

  // Convert followerId to ObjectId
  const objectIdFollower = new mongoose.Types.ObjectId(trimmedFollowerId);

  const isUserExist = await UserModel.findById(objectIdFollower);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isFollowerAlreadyExist = await UserModel.findOne({
    _id: user._id,
    following: { $in: [isUserExist._id] },
  });

  if (isFollowerAlreadyExist) {
    throw new AppError(httpStatus.CONFLICT, `You Are already following`);
  }

  // Start a Mongoose session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update the user with the session to track this operation within the transaction
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { $push: { following: objectIdFollower } }, // Use ObjectId here
      { new: true, session }, // Pass the session here
    );

    // Check if the user exists
    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'The user does not exist');
    }

    await UserModel.findByIdAndUpdate(
      objectIdFollower,
      { $push: { followers: user._id } },
      { new: true, session }, // Pass the session here
    );

    // Commit the transaction if everything goes well
    await session.commitTransaction();
    session.endSession(); // End the session

    return updatedUser;
  } catch (error) {
    // Abort the transaction if an error occurs
    await session.abortTransaction();
    session.endSession(); // End the session

    // Re-throw the error so it can be handled by higher-level error handlers
    throw error;
  }
};

const unfollowUser = async (user: TUser, followerId: string) => {
  // Trim the followerId to remove any leading/trailing spaces
  const trimmedFollowerId = followerId.trim();

  // Convert followerId to ObjectId
  const objectIdFollower = new mongoose.Types.ObjectId(trimmedFollowerId);

  console.log(objectIdFollower);

  // Check if the user to unfollow exists
  const isUserExist = await UserModel.findById(objectIdFollower);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Start a Mongoose session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the user is already following the target user
    const isFollowing = await UserModel.findOne({
      _id: user._id,
      following: { $in: [objectIdFollower] },
    });

    if (!isFollowing) {
      throw new AppError(
        httpStatus.CONFLICT,
        'You are not following this user',
      );
    }

    // Update the user to remove the following relationship
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { $pull: { following: objectIdFollower } }, // Use $pull to remove the follower
      { new: true, session }, // Pass the session here
    );

    // Check if the user exists
    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'The user does not exist');
    }

    // Also remove the user from the followers list of the unfollowed user
    await UserModel.findByIdAndUpdate(
      objectIdFollower,
      { $pull: { followers: user._id } }, // Use $pull to remove the user from followers
      { new: true, session }, // Pass the session here
    );

    // Commit the transaction if everything goes well
    await session.commitTransaction();
    session.endSession(); // End the session

    return updatedUser; // Return the updated user information
  } catch (error) {
    // Abort the transaction if an error occurs
    await session.abortTransaction();
    session.endSession(); // End the session

    // Re-throw the error so it can be handled by higher-level error handlers
    throw error;
  }
};

export const authService = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
  signupUser,
  getUserProfile,
  updateUserProfile,
  addFollower,
  unfollowUser,
};
