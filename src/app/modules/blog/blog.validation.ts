import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z.custom<Types.ObjectId>(
  (value) => {
    return Types.ObjectId.isValid(value);
  },
  {
    message: 'Invalid ObjectId',
  },
);

const createBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    author: objectIdSchema,
    content: z.string().min(1, 'Content is required'),
    category: z.string().min(1, 'Category is required'),
    subscription: z.enum(['free', 'premium']),
    featuredImage: z.string().url(),
    likes: z.array(objectIdSchema).optional(),
    dislikes: z.array(objectIdSchema).optional(),
  }),
});
const updateBlogValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    slug: z.string().min(1, 'Slug is required').optional(),
    content: z.string().min(1, 'Content is required').optional(),
    featuredImage: z.string().url().optional(),
  }),
});

export const blogValidation = {
  createBlogValidationSchema,
  updateBlogValidation,
};
