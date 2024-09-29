import { Schema, model } from 'mongoose';
import { TUser, TUserModel } from './auth.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

// Define the schema for the User model with validation messages
const userSchema = new Schema<TUser, TUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    passwordChangeAt: { type: Date },
    password: {
      type: String,
      select: 0,
      required: [true, 'Password is required'],
      minlength: [4, 'Password must be at least 4 characters long'],
    },
    photoUrl: { type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1200px-User_icon_2.svg.png' },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      minlength: [10, 'Phone number must be at least 10 characters long'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: [true, 'Role is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Pre-save middleware to hash the password
userSchema.pre('save', async function (next) {
  const user = this as TUser;

  // Hash password if it's new or being modified
  if (user.passwordChangeAt && user.passwordChangeAt.toISOString) {
    if (
      user.passwordChangeAt.toISOString() !==
      user.passwordChangeAt.toISOString()
    ) {
      user.password = await bcrypt.hash(
        user.password,
        Number(config.saltRound),
      );
    }
  }

  next();
});

// Static method to check if a user exists by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await UserModel.findOne({ email }).select('+password');
};

// Static method to check if passwords match
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Static method to hash a password (reusable)
userSchema.statics.hashPassword = async function (
  password: string,
): Promise<string> {
  return await bcrypt.hash(password, Number(config.saltRound));
};

export const UserModel = model<TUser, TUserModel>('User', userSchema);
