const Category = require('../models/Category');
const Product = require('../models/Product');

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

// GET /api/categories
// Returns categories; supports ?all=true to return inactive ones for admin
const getAllCategories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.all !== 'true') {
      filter.isActive = true;
    }

    const categories = await Category.find(filter).sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: error.message,
    });
  }
};

// POST /api/admin/categories (Protected)
const createCategory = async (req, res) => {
  try {
    const { name, description, image, order, isActive, isFeatured } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    let slug = req.body.slug ? slugify(req.body.slug) : slugify(name);
    let existingSlug = await Category.findOne({ slug });
    let counter = 1;
    while (existingSlug) {
      slug = `${slugify(name)}-${counter}`;
      existingSlug = await Category.findOne({ slug });
      counter++;
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: (description || '').trim(),
      image: (image || '').trim(),
      order: Number(order) || 0,
      isActive: isActive !== false,
      isFeatured: Boolean(isFeatured),
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('❌ Error creating category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating category',
      error: error.message,
    });
  }
};

// PUT /api/admin/categories/:id (Protected)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let category = await Category.findById(id);
    if (!category) {
      category = await Category.findOne({ slug: id });
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, description, image, order, isActive, isFeatured } = req.body;

    if (name !== undefined) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image.trim();
    if (order !== undefined) category.order = Number(order) || 0;
    if (isActive !== undefined) category.isActive = Boolean(isActive);
    if (isFeatured !== undefined) category.isFeatured = Boolean(isFeatured);

    const updated = await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('❌ Error updating category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating category',
      error: error.message,
    });
  }
};

// DELETE /api/admin/categories/:id (Protected)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let category = await Category.findById(id);
    if (!category) {
      category = await Category.findOne({ slug: id });
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const productCount = await Product.countDocuments({ category: category.slug });
    const { moveToCategory, force } = req.query;

    if (productCount > 0) {
      if (moveToCategory) {
        // Move products to target category first
        await Product.updateMany(
          { category: category.slug },
          { $set: { category: moveToCategory.toLowerCase().trim() } }
        );
        console.log(`📦 Moved ${productCount} products from "${category.slug}" to "${moveToCategory}"`);
      } else if (force !== 'true') {
        const otherCategories = await Category.find({ slug: { $ne: category.slug } }).select('name slug');
        return res.status(400).json({
          success: false,
          hasProducts: true,
          productCount,
          otherCategories,
          message: `Cannot delete category "${category.name}". It contains ${productCount} product(s). Please move products to another category or force delete.`,
        });
      }
    }

    await Category.deleteOne({ _id: category._id });

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
      data: { id: category._id, slug: category.slug, reassignedTo: moveToCategory || null },
    });
  } catch (error) {
    console.error('❌ Error deleting category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category',
      error: error.message,
    });
  }
};

// POST /api/admin/categories/reassign-and-delete (Protected)
const reassignAndDeleteCategory = async (req, res) => {
  try {
    const { categoryId, targetCategorySlug } = req.body;
    if (!categoryId || !targetCategorySlug) {
      return res.status(400).json({
        success: false,
        message: 'categoryId and targetCategorySlug are required',
      });
    }

    let category = await Category.findById(categoryId);
    if (!category) category = await Category.findOne({ slug: categoryId });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Source category not found' });
    }

    const targetCategory = await Category.findOne({ slug: targetCategorySlug.toLowerCase().trim() });
    if (!targetCategory) {
      return res.status(404).json({ success: false, message: 'Target category not found' });
    }

    // Reassign products
    const reassignResult = await Product.updateMany(
      { category: category.slug },
      { $set: { category: targetCategory.slug } }
    );

    // Delete category
    await Category.deleteOne({ _id: category._id });

    res.status(200).json({
      success: true,
      message: `Moved ${reassignResult.modifiedCount} product(s) to "${targetCategory.name}" and deleted "${category.name}".`,
      reassignedCount: reassignResult.modifiedCount,
    });
  } catch (error) {
    console.error('❌ Error reassigning and deleting category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during category reassignment and deletion',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reassignAndDeleteCategory,
};
