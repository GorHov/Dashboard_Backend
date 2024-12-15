import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import fs from 'fs';
import path from 'path';

// Create a product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price } = req.body;

  const userId = req.userData?.userId || 0

  try {
    const product = await Product.create({ name, description, price, userId });
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    next(err);
  }
};

// Get all products (public access)
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await Product.findAll();
      res.json({ products });
    } catch (err) {
      next(err);
    }
  };
  
  // Get products for the logged-in user
  export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userData?.userId;
  
    try {
      const products = await Product.findAll({ where: { userId } });
      res.json({ products });
    } catch (err) {
      next(err);
    };
  };

// Update a product by ID
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, discountPrice } = req.body;
    const { id } = req.params;
    const userId = req?.userData?.userId;

    const product = await Product.findOne({ where: { id, userId } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or not owned by user' });
    }
    // @ts-ignore
    if (req.file) {
      // @ts-ignore
      const filePath = `uploads/${req.file.filename}`;

      if (product.image) {
        const oldPath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      product.image = filePath;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;

    await product.save();

    res.json({
      message: 'Product updated successfully',
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.image,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.userData?.userId;

  try {
    const product = await Product.findOne({ where: { id, userId } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or not owned by user' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (err) {
    next(err);
  }
};
