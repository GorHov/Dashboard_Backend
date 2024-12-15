import { Router } from 'express';
import { authMiddleware } from '../middleware/checkAuth';
import { createProduct, deleteProduct, getAllProducts, getProducts, updateProduct, getProductById } from '../controllers/productController';
import { upload } from '../middleware/saveFile';

const router = Router();

// Public route to get all products
router.get('/products/all', getAllProducts);

// Route to get a single product by ID
router.get('/product/:id', getProductById);

// Route to get products for the logged-in user
router.get('/products', authMiddleware, getProducts);

// Routes requiring authentication
router.post('/product', authMiddleware, createProduct);
router.patch('/product/:id', authMiddleware, upload.single('image'), updateProduct);
router.delete('/product/:id', authMiddleware, deleteProduct);

export { router as productRouter };
