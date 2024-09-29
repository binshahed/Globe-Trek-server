import httpStatus from 'http-status';

import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';

import jwt, { JwtPayload } from 'jsonwebtoken';

import config from '../config';
import AuthorizationError from '../errors/AuthorizationError';
import { TUserRole } from '../modules/auth/auth.interface';
import catchAsync from '../utils/catchAsync';
import { UserModel } from '../modules/auth/auth.model';

export const verifyToken = (token: string, key: string) => {
  return jwt.verify(token, key) as JwtPayload;
};

const auth = (...allowedRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AuthorizationError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route',
      );
    }

    const decodedToken = verifyToken(
      token,
      config.jwtAccessSecretKey as string,
    );
    if (!decodedToken) {
      throw new AuthorizationError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }

    const user = await UserModel.findById(decodedToken?.data?._id);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'Invalid token');
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      throw new AuthorizationError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route',
      );
    }

    // Attach user to request object for future use
    req.user = user;

    next();
  });
};

export default auth;
