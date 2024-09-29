/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TUserRole = 'admin' | 'user';

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  passwordChangeAt?: Date;
  password: string;
  phone: string;
  photoUrl: string;
  subscriptions: 'free' | 'premium';
  role: TUserRole;
  address: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
};

export interface TUserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    textPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJwtIssuedBeforePasswordChanged(
    passwordChangeTime: Date,
    jwtIssuedTimeStamp: number,
  ): boolean;
  hashPassword(password: string): Promise<string>; // Add this line
  isUserExistsByEmail(email: string): Promise<TUser>;
}

export type TUserLogin = {
  email: string;
  password: string;
};

export type TUserSignUp = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

export type TPasswordChange = {
  oldPassword: string;
  newPassword: string;
};

export type TSubscriptions = 'free' | 'premium';
