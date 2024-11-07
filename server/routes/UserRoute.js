import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshTokenUser } from "../controllers/UserRefreshToken.js";
import { getUser, Register, Login, Logout  } from '../controllers/UserController.js';

const router = express.Router();
 
// User
router.get('/users', verifyToken, getUser);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshTokenUser);
router.delete('/logout', Logout);

export default router;

