const Product = require("../models/productModel");

// Utility functions for filtering, searching, and paginating
const searchProducts = (query, params) => {
  if (params.keyword) {
    query.name = { $regex: params.keyword, $options: "i" };
  }
  return query;
};

const filterProducts = (query, params) => {
  const filterParams = { ...params };
  // Remove unwanted fields
  delete filterParams.keyword;
  delete filterParams.limit;
  delete filterParams.page;

  // Filter by price
  if (filterParams.price) {
    const priceFilter = JSON.parse(filterParams.price);
    if (priceFilter.lt) {
      query.price = { $lt: parseFloat(priceFilter.lt) };
    }
    if (priceFilter.lte) {
      query.price = { ...query.price, $lte: parseFloat(priceFilter.lte)};
    }
    if (priceFilter.gt) {
      query.price = { ...query.price, $gt: parseFloat(priceFilter.gt) };
    }
    if (priceFilter.gte) {
      query.price = { ...query.price, $gte: parseFloat(priceFilter.gte) };
    }
    delete filterParams.price;
  }

  // Filter by category
  if (filterParams.category) {
    query.category = { $regex: filterParams.category, $options: "i" };
    delete filterParams.category;
  }

  // Handle other filters
  for (const key in filterParams) {
    if (filterParams[key]) {
      filterParams[key] = { $regex: filterParams[key], $options: "i" };
    }
  }

  return { ...query, ...filterParams };
};

const paginateProducts = (query, params, itemsPerPage) => {
  const page = Number(params.page) || 1;
  const skip = itemsPerPage * (page - 1);
  return query.limit(itemsPerPage).skip(skip);
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 12; // Number of products per page
    const productsCount = await Product.countDocuments(); // Count all products

    let queryObj = {}; // Start with an empty query object

    // Only apply search/filters if any query parameters are present
    if (req.query.keyword || req.query.price || req.query.category) {
      queryObj = searchProducts(queryObj, req.query); // Apply search
      queryObj = filterProducts(queryObj, req.query); // Apply filters
    }

    // Query for filtered products without pagination
    const filteredProductsCount = await Product.countDocuments(queryObj); // Count only filtered products

    // Now, apply pagination to the original query
    let query = Product.find(queryObj); // Find products based on query
    query = paginateProducts(query, req.query, resultPerPage); // Apply pagination

    const products = await query; // Get the products

    // Send the response
    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products ---Product Sliders
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product Details by id
exports.getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products ---ADMIN
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Product ---ADMIN
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image_url, category ,star} = req.body;
    if (!name || !description || !price || !image_url || !category  || !star) {

      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, description, price, image_url, and category.",
      });
    }

    // Create the product using the provided fields
    const product = await Product.create({
      name,
      description,
      price,
      image_url,
      category,
      ratings: req.body.star || 0,
      numOfReviews: req.body.numOfReviews || 0,
      reviews: req.body.reviews || [],
      userID: req.user.id,
    });

    // Send the response after creating the product
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    // Catch and return any errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product ---ADMIN
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    console.log(product)

    // Only update the necessary fields
    const updatedData = {
      name: req.body.name || product.name,
      description: req.body.description || product.description,
      price: req.body.price || product.price,
      image_url: req.body.image_url || product.image_url,
      category: req.body.category || product.category,
      ratings: req.body.ratings || product.ratings,
      numOfReviews: req.body.numOfReviews || product.numOfReviews,
      reviews: req.body.reviews || product.reviews,
    };

    // Update the product with the provided data
    product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    // Send the response after successful update
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product ---ADMIN
exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id); 
    console.log(product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    await Product.findByIdAndDelete(product._id); 

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create OR Update Product Review
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    // Create review object
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // Check if the user has already reviewed this product
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      // Update the existing review
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      // Add a new review
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // Calculate the average rating
    const totalRatings = product.reviews.reduce(
      (acc, rev) => acc + rev.rating,
      0
    );
    product.ratings = totalRatings / product.reviews.length;

    // Save the updated product with reviews
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: isReviewed
        ? "Review updated successfully"
        : "Review added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.query;

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // Filter out the review to be deleted
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== reviewId.toString()
    );

    // Recalculate the average rating
    const totalRatings = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    const ratings = reviews.length === 0 ? 0 : totalRatings / reviews.length;

    // Update the product
    product.reviews = reviews;
    product.ratings = ratings;
    product.numOfReviews = reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Reviews of a product
exports.getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
