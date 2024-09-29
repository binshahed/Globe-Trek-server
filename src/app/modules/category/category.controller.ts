import httpStatus from 'http-status';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { categoryService } from './auth.service';

const createCategory = catchAsync(async (req, res) => {
  const result = await categoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
})

export const categoryController = {
  createCategory,
  getAllCategories
};
