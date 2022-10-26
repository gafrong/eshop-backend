const { getProducts, getProduct, updateProduct, deleteProduct, getProductCount, getFeaturedProductsOfCounts, createProduct } = require('../controllers/product');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const { requireSignin, adminMiddleware } = require('../common-middleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-')
      cb(null, shortid.generate() + '-' + fileName)
    }
  })
  
const upload = multer({ storage })


router.get(`/`, getProducts);
router.get(`/:id`, getProduct);
router.post(`/create`, upload.array('productImages'), requireSignin, adminMiddleware, createProduct);
router.put('/:id', upload.array('productImages'), updateProduct, requireSignin, adminMiddleware);
router.delete(`/:id`, requireSignin, adminMiddleware, deleteProduct);
router.get(`/get/count`, getProductCount);

// get only the count number of featured products
router.get(`/get/featured/:count`, getFeaturedProductsOfCounts);

module.exports = router;