/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { TBlog } from './blog.interface';
import BlogModel from './blog.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createBlog = async (payload: TBlog) => {
  // Implement the blog creation logic here, using the provided payload
  // Return the created blog object

  // Example implementation
  const blog = await BlogModel.create(payload);
  return blog;
};
const updateBlog = async (
  user: any,
  blogId: string,
  payload: Partial<TBlog>,
) => {
  // Check if the blog exists and belongs to the user
  const isBlogExist = await BlogModel.findOne({
    _id: blogId,
    author: user._id,
  });

  if (!isBlogExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Blog not found or you do not have permission to edit this blog',
    );
  }

  // Use a single query to find and update the blog
  const updatedBlog = await BlogModel.findOneAndUpdate(
    { _id: blogId, author: user._id }, // Ensure the user owns the blog
    { ...payload }, // Update the blog with the payload data
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure validators are run on update
    },
  );

  // Check if the blog was updated successfully
  if (!updatedBlog) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Blog not found or you do not have permission to edit this blog',
    );
  }

  return updatedBlog;
};

const getAllBlogs = async (query: Record<string, unknown>) => {
  // Implement the logic to retrieve all blogs from the database
  // Return an array of blog objects

  const blogQuery = new QueryBuilder(BlogModel.find(), query).paginate().sort();

  return blogQuery.modelQuery.populate('author').exec();
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

const likeToggle = async (userId: Types.ObjectId, blogId: Types.ObjectId) => {
  // Find the blog post by its ID
  const blog = await BlogModel.findById(blogId);
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  // Check if the user has already liked the blog
  const isLiked = blog.likes.includes(userId);

  if (isLiked) {
    // If liked, remove the user's ID from the likes array (unlike)
    blog.likes = blog.likes.filter((id) => !id.equals(userId));
  } else {
    // If not liked, add the user's ID to the likes array (like)
    blog.likes.push(userId);
  }

  // Save the updated blog post
  await blog.save();

  return blog;
};
const disLikeToggle = async (
  userId: Types.ObjectId,
  blogId: Types.ObjectId,
) => {
  // Find the blog post by its ID
  const blog = await BlogModel.findById(blogId);
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  // Check if the user has already liked the blog
  const isLiked = blog.dislikes.includes(userId);

  if (isLiked) {
    // If liked, remove the user's ID from the likes array (unlike)
    blog.dislikes = blog.dislikes.filter((id) => !id.equals(userId));
  } else {
    // If not liked, add the user's ID to the likes array (like)
    blog.dislikes.push(userId);
  }

  // Save the updated blog post
  await blog.save();

  return blog;
};

export const blogService = {
  createBlog,
  getAllBlogs,
  myBlogs,
  blogDetails,
  likeToggle,
  disLikeToggle,
  updateBlog,
};
