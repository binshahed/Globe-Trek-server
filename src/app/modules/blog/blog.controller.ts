/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { blogService } from './blog.service';

const createBlog = catchAsync(async (req, res) => {
  const result = await blogService.createBlog(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const result = await blogService.getAllBlogs(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All blogs retrieved successfully',
    data: result,
  });
});

const myBlogs = catchAsync(async (req, res) => {
  const result = await blogService.myBlogs(req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My blogs retrieved successfully',
    data: result,
  });
});

const blogDetails = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await blogService.blogDetails(blogId as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog details retrieved successfully',
    data: result,
  });
});

export const blogController = {
  createBlog,
  getAllBlogs,
  myBlogs,
  blogDetails,
};
