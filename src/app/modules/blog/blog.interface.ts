/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export interface TBlog {
  title: string;
  slug: string;
  author: Types.ObjectId;
  content: string;
  category: Types.ObjectId;
  subsCription: 'free' | 'premium';
  featuredImage: string;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
}
