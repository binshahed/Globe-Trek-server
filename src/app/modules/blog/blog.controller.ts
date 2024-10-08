/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { blogService } from './blog.service';
import BlogModel from './blog.model';
import fetch from 'node-fetch'; // For fetching the image
import { PDFDocument } from 'pdf-lib';
import AppError from '../../errors/AppError';
import puppeteer from 'puppeteer';

const createBlog = catchAsync(async (req, res) => {
  const result = await blogService.createBlog(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const user = req.user;
  const result = await blogService.updateBlog(
    user?._id,
    blogId as any,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
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

const likeToggle = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await blogService.likeToggle(req.user._id, blogId as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Like toggled successfully',
    data: result,
  });
});
const disLikeToggle = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await blogService.disLikeToggle(req.user._id, blogId as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dislike toggled successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const user = req.user;
  const result = await blogService.deleteBlog(user?._id, blogId as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: result,
  });
});

const getPdf = catchAsync(async (req, res) => {
  const { blogId } = req.params;

  // Fetch the blog from the database
  const blog = await BlogModel.findById(blogId);
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Create the HTML content for the blog, you can add more formatting here
    const contentHTML = `
      <html>
        <head>
          <title>${blog.title}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { text-align: center; }
            img { max-width: 100%; height: auto; }
            p { margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>${blog.title}</h1>
          <img src="${blog.featuredImage}" alt="Featured Image" />
          <p>${blog.content}</p>
          <p><strong>Author:</strong> ${blog.author}</p>
         
        </body>
      </html>
    `;

    // Set the content for the PDF
    await page.setContent(contentHTML);

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    // Close Puppeteer
    await browser.close();

    // Send the PDF file in the response
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${blog.title}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating PDF');
  }
});

export const blogController = {
  createBlog,
  getAllBlogs,
  myBlogs,
  blogDetails,
  likeToggle,
  disLikeToggle,
  updateBlog,
  deleteBlog,
  getPdf,
};
