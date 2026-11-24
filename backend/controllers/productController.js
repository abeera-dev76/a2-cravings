const Product = require('../models/Product');
const Category = require('../models/Category');

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

// Helper to auto-create category if it does not exist
const ensureCategoryExists = async (categoryInput) => {
  if (!categoryInput) return 'menu';
  const cleanName = categoryInput.trim();
  const slug = slugify(cleanName);

  let existing = await Category.findOne({ slug });
  if (!existing) {
    const count = await Category.countDocuments();
    existing = await Category.create({
      name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      slug,
      order: count + 1,
      isActive: true,
    });
    console.log(`✅ Dynamically created new category: "${existing.name}" (${existing.slug})`);
  }
  return existing.slug;
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
    const {
      name,
      category,
      price,
      discountPrice,
      sku,
      description,
      image,
      fallbackImage,
      badge,
      isAvailable,
      isFeatured,
      isBestseller,
      isNewArrival,
      prepTime,
      sizes,
      addons,
      order,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Product category is required' });
    }
    if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'A valid non-negative price is required' });
    }

    // Ensure category exists in MongoDB or dynamically create it
    const finalCategorySlug = await ensureCategoryExists(category);

    let slug = req.body.slug ? slugify(req.body.slug) : slugify(name);
    let existingSlug = await Product.findOne({ slug });
    let counter = 1;
    while (existingSlug) {
      slug = `${slugify(name)}-${counter}`;
      existingSlug = await Product.findOne({ slug });
      counter++;
    }

    // Auto-generate SKU if none provided
    const finalSku = sku && sku.trim()
      ? sku.trim().toUpperCase()
      : `A2-${finalCategorySlug.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const product = await Product.create({
      name: name.trim(),
      slug,
      sku: finalSku,
      category: finalCategorySlug,
      price: Math.round(Number(price)),
      discountPrice: discountPrice !== undefined && discountPrice !== null && !isNaN(discountPrice) && Number(discountPrice) > 0
        ? Math.round(Number(discountPrice))
        : null,
      description: (description || '').trim(),
      image: (image || '').trim(),
      fallbackImage: (fallbackImage || '').trim(),
      badge: (badge || '').trim(),
      isAvailable: isAvailable !== false,
      isFeatured: Boolean(isFeatured),
      isBestseller: Boolean(isBestseller),
      isNewArrival: Boolean(isNewArrival),
      prepTime: (prepTime || '').trim(),
      sizes: Array.isArray(sizes) ? sizes.filter((s) => s.name && s.price !== undefined) : [],
      addons: Array.isArray(addons) ? addons.filter((a) => a.name && a.price !== undefined) : [],
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

    const {
      name,
      category,
      price,
      discountPrice,
      sku,
      description,
      image,
      fallbackImage,
      badge,
      isAvailable,
      isFeatured,
      isBestseller,
      isNewArrival,
      prepTime,
      sizes,
      addons,
      order,
    } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) {
      const finalCategorySlug = await ensureCategoryExists(category);
      product.category = finalCategorySlug;
    }
    if (price !== undefined) {
      if (isNaN(price) || Number(price) < 0) {
        return res.status(400).json({ success: false, message: 'Price cannot be negative' });
      }
      product.price = Math.round(Number(price));
    }
    if (discountPrice !== undefined) {
      product.discountPrice = discountPrice !== null && !isNaN(discountPrice) && Number(discountPrice) > 0
        ? Math.round(Number(discountPrice))
        : null;
    }
    if (sku !== undefined) product.sku = sku.trim().toUpperCase();
    if (description !== undefined) product.description = description.trim();
    if (image !== undefined) product.image = image.trim();
    if (fallbackImage !== undefined) product.fallbackImage = fallbackImage.trim();
    if (badge !== undefined) product.badge = badge.trim();
    if (isAvailable !== undefined) product.isAvailable = Boolean(isAvailable);
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isBestseller !== undefined) product.isBestseller = Boolean(isBestseller);
    if (isNewArrival !== undefined) product.isNewArrival = Boolean(isNewArrival);
    if (prepTime !== undefined) product.prepTime = prepTime.trim();
    if (sizes !== undefined && Array.isArray(sizes)) {
      product.sizes = sizes.filter((s) => s.name && s.price !== undefined);
    }
    if (addons !== undefined && Array.isArray(addons)) {
      product.addons = addons.filter((a) => a.name && a.price !== undefined);
    }
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

// POST /api/admin/products/duplicate/:id (Protected)
const duplicateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let source = await Product.findById(id);
    if (!source) source = await Product.findOne({ slug: id });

    if (!source) {
      return res.status(404).json({ success: false, message: 'Source product not found' });
    }

    const newName = `${source.name} (Copy)`;
    let slug = slugify(newName);
    let existingSlug = await Product.findOne({ slug });
    let counter = 1;
    while (existingSlug) {
      slug = `${slugify(newName)}-${counter}`;
      existingSlug = await Product.findOne({ slug });
      counter++;
    }

    const newSku = `A2-${source.category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const cloned = await Product.create({
      name: newName,
      slug,
      sku: newSku,
      category: source.category,
      price: source.price,
      discountPrice: source.discountPrice,
      description: source.description,
      image: source.image,
      fallbackImage: source.fallbackImage,
      badge: source.badge,
      isAvailable: source.isAvailable,
      isFeatured: source.isFeatured,
      isBestseller: source.isBestseller,
      isNewArrival: source.isNewArrival,
      prepTime: source.prepTime,
      sizes: source.sizes,
      addons: source.addons,
      order: (source.order || 0) + 1,
      alt: `${newName} - A2 Cravings`,
    });

    res.status(201).json({
      success: true,
      message: `Product '${source.name}' duplicated successfully`,
      data: cloned,
    });
  } catch (error) {
    console.error('❌ Error duplicating product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while duplicating product',
      error: error.message,
    });
  }
};

// PATCH /api/admin/products/bulk-availability (Protected)
const bulkUpdateAvailability = async (req, res) => {
  try {
    const rawIds = req.body.ids || req.body.productIds;
    const { isAvailable } = req.body;
    if (!Array.isArray(rawIds) || rawIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of product IDs' });
    }

    const result = await Product.updateMany(
      { _id: { $in: rawIds } },
      { $set: { isAvailable: Boolean(isAvailable) } }
    );

    res.status(200).json({
      success: true,
      message: `Updated availability for ${result.modifiedCount} product(s)`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('❌ Error in bulk availability update:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating bulk availability',
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
  duplicateProduct,
  bulkUpdateAvailability,
  deleteProduct,
  toggleProductAvailability,
};
