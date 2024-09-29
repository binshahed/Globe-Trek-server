import { model, Schema } from 'mongoose';

const categorySchema = new Schema({
  name: { type: 'string', required: true, trim: true, unique: true },
});

export const CategoryModel = model('category', categorySchema);
