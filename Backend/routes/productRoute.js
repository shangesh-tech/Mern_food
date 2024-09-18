const express = require('express');
const { getAllProducts, getProductDetails, updateProduct, deleteProduct, getProductReviews, deleteReview, createProductReview, createProduct, getAdminProducts, getProducts } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

//Create a product ADMIN
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

//update & delete products ADMIN
router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

//get all the products (USERS)

router.route('/products').get(getAllProducts);
router.route('/products/all').get(getProducts);


// ADMIN -->  get all products

router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);


// get product details (USERS)

router.route('/product/:id').get(getProductDetails);

//  get product reviews (USERS)

router.route('/review').put(isAuthenticatedUser, createProductReview);

//   get product reviews (ADMIN)

router.route('/admin/reviews')
    .get(getProductReviews)
    .delete(isAuthenticatedUser, deleteReview);

module.exports = router;