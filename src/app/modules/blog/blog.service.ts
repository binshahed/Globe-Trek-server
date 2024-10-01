/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { TBlog } from './blog.interface';
import BlogModel from './blog.model';

const createBlog = async (payload: TBlog) => {
  // Implement the blog creation logic here, using the provided payload
  // Return the created blog object

  // Example implementation
  const blog = await BlogModel.create(payload);
  return blog;
};

const getAllBlogs = async (query: Record<string, unknown>) => {
  // Implement the logic to retrieve all blogs from the database
  // Return an array of blog objects

  const blogQuery = new QueryBuilder(BlogModel.find(), query).sort();

  return blogQuery.modelQuery.exec();
};

const myBlogs = async (userId: Types.ObjectId) => {
  const blog = await BlogModel.find({ author: userId })
    .populate('author')
    .sort({ createdAt: -1 });

  return blog;
};

const blogDetails = async (id: any) => {
  const blog = await BlogModel.findById(id)
    .populate('author')
    .populate('likes')
    .populate('dislikes');

  return blog;
};

export const blogService = {
  createBlog,
  getAllBlogs,
  myBlogs,
  blogDetails,
};
