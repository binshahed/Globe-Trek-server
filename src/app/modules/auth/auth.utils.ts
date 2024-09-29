import jwt, { JwtPayload } from 'jsonwebtoken'


export const createToken = (
  payload: {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    address: string;
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
  )
}

export const verifyToken = (token: string, key: string) => {
  return jwt.verify(token, key) as JwtPayload
}
