const Product = require('../models/Product');

// Helper to generate a slug from name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// GET /api/products
// Returns products; supports optional ?category=pasta and ?includeUnavailable=true
const getAllProducts = async (req, res) => {
  try {
    const filter = {};

    // Only filter by isAvailable if not explicitly requesting all (e.g. for admin)
    if (req.query.includeUnavailable !== 'true') {
      filter.isAvailable = true;
    }

    // If ?category=pasta query param is provided, filter by it
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category.toLowerCase().trim();
    }

    const products = await Product.find(filter).sort({ order: 1, category: 1, name: 1 });

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

    let product = await Product.findOne({ slug: id });

    if (!product) {
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

// POST /api/admin/products (Protected)
const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, image, fallbackImage, badge, isAvailable, order } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Product category is required' });
    }
    if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'A valid non-negative price is required' });
    }

    let slug = req.body.slug ? slugify(req.body.slug) : slugify(name);
    let existingSlug = await Product.findOne({ slug });
    let counter = 1;
    while (existingSlug) {
      slug = `${slugify(name)}-${counter}`;
      existingSlug = await Product.findOne({ slug });
      counter++;
    }

    const product = await Product.create({
      name: name.trim(),
      slug,
      category: category.toLowerCase().trim(),
      price: Math.round(Number(price)),
      description: (description || '').trim(),
      image: (image || '').trim(),
      fallbackImage: (fallbackImage || '').trim(),
      badge: (badge || '').trim(),
      isAvailable: isAvailable !== false,
      order: Number(order) || 0,
      alt: `${name.trim()} - A2 Cravings`,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('❌ Error creating product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
      error: error.message,
    });
  }
};

// PUT /api/admin/products/:id (Protected)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);
    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, category, price, description, image, fallbackImage, badge, isAvailable, order } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.toLowerCase().trim();
    if (price !== undefined) {
      if (isNaN(price) || Number(price) < 0) {
        return res.status(400).json({ success: false, message: 'Price cannot be negative' });
      }
      product.price = Math.round(Number(price));
    }
    if (description !== undefined) product.description = description.trim();
    if (image !== undefined) product.image = image.trim();
    if (fallbackImage !== undefined) product.fallbackImage = fallbackImage.trim();
    if (badge !== undefined) product.badge = badge.trim();
    if (isAvailable !== undefined) product.isAvailable = Boolean(isAvailable);
    if (order !== undefined) product.order = Number(order) || 0;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('❌ Error updating product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
      error: error.message,
    });
  }
};

// DELETE /api/admin/products/:id (Protected)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);
    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.deleteOne({ _id: product._id });

    res.status(200).json({
      success: true,
      message: `Product '${product.name}' deleted successfully`,
      data: { id: product._id, slug: product.slug },
    });
  } catch (error) {
    console.error('❌ Error deleting product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      error: error.message,
    });
  }
};

// PATCH /api/admin/products/:id/toggle-availability (Protected)
const toggleProductAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);
    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product is now ${product.isAvailable ? 'available' : 'unavailable'}`,
      data: product,
    });
  } catch (error) {
    console.error('❌ Error toggling product availability:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product status',
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
};
