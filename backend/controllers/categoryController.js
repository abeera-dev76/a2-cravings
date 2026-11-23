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
    const { name, order, isActive } = req.body;

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
      order: Number(order) || 0,
      isActive: isActive !== false,
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

    const { name, order, isActive } = req.body;

    if (name !== undefined) category.name = name.trim();
    if (order !== undefined) category.order = Number(order) || 0;
    if (isActive !== undefined) category.isActive = Boolean(isActive);

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

    // Safety check: Are any products assigned to this category?
    const productCount = await Product.countDocuments({ category: category.slug });
    if (productCount > 0 && req.query.force !== 'true') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${category.name}". It still contains ${productCount} product(s). Please reassign or delete these products first.`,
        productCount,
      });
    }

    await Category.deleteOne({ _id: category._id });

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
      data: { id: category._id, slug: category.slug },
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

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
