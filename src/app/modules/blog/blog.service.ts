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

export const blogService = {
  createBlog,
  getAllBlogs,
};
