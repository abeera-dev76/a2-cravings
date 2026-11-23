const Product = require('../models/Product');

// GET /api/products
// Returns all available products; supports optional ?category=pasta filter
const getAllProducts = async (req, res) => {
  try {
    const filter = { isAvailable: true };

    // If ?category=pasta query param is provided, filter by it
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category.toLowerCase().trim();
    }

    const products = await Product.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: error.message,
    });
  }
};

// GET /api/products/:id
// Returns a single product by its MongoDB _id OR slug
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by slug first; if not found, try by _id
    let product = await Product.findOne({ slug: id });

    if (!product) {
      // Check if id looks like a valid MongoDB ObjectId
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      }
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id or slug: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('❌ Error fetching product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
    });
  }
};

module.exports = { getAllProducts, getProductById };
