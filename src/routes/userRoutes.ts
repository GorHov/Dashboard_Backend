import { Router } from 'express';
import { createUser, loginUser, logout, updateUser } from '../controllers/userController';
import { upload } from '../middleware/saveFile';
import { authMiddleware } from '../middleware/checkAuth';

const router = Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/logout', logout);

// Update user profile (with Multer for image upload)
router.patch('/update', authMiddleware, upload.single('image'), updateUser);

export { router as userRouter };
