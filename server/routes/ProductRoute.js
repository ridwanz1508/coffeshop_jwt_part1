import express from "express";
import { getProducts, getProductByID, saveProduct, updateProduct, deleteProduct } from '../controllers/ProductController.js';

const router = express.Router();
 
// Products
router.get('/products', getProducts);
router.get('/products/:id', getProductByID);
router.post('/products', saveProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
  
