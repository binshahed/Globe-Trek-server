import { z } from 'zod'


const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required' }),
    newPassword: z.string({ required_error: 'New password is required' }),
  }),
})

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
})

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'email is required' }),
  }),
})
const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Id is required' }),
    newPassword: z.string({ required_error: 'Id is required' }),
  }),
})

// Define the validation schema for creating a user
const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(4, { message: 'Password must be at least 4 characters long' }),
    phone: z
      .string()
      .min(10, { message: 'Phone number must be 10 digits long' }),
    
    address: z.string({ message: 'Address is required' }),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(4, { message: 'Password must be at least 4 characters long' }),
  }),
});

// Export the validation schema to use it in other parts of the application


export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
  createUserValidationSchema,
}



