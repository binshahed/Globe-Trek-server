import jwt, { JwtPayload } from 'jsonwebtoken'
import { TSubscriptions } from './auth.interface';

export const createToken = (
  payload: {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    address: string;
    subscriptions: TSubscriptions;
  },
  secretKey: string,
  expireTime: string,
) => {
  return jwt.sign(
    {
      data: payload,
    },
    secretKey,
    { expiresIn: expireTime },
  );
};

export const verifyToken = (token: string, key: string) => {
  return jwt.verify(token, key) as JwtPayload
}
