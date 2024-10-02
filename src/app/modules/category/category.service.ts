import { CategoryModel } from './category.model';

const createCategory = async (payload: { name: string }) => {
  const categoryModel = await CategoryModel.findOne({ name: payload.name });

  if (categoryModel) {
    throw new Error('Category already exists');
  }

  return await CategoryModel.create(payload);
};

const getAllCategories = async () => {
  return await CategoryModel.find();
};

export const categoryService = {
  createCategory,
  getAllCategories,
};
