// Seed script: populates MongoDB with categories and products from frontend menuData
// Run once with: node seed.js
// Safe to re-run: clears existing data first to avoid duplicates

require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');

// ─── Data (exact copy from frontend/src/data/menuData.js) ────────────────────

const categoriesData = [
  { slug: 'pasta',        name: 'Pasta',        order: 1 },
  { slug: 'buns',         name: 'Buns',         order: 2 },
  { slug: 'loaded-fries', name: 'Loaded Fries', order: 3 },
  { slug: 'biryani',      name: 'Biryani',      order: 4 },
  { slug: 'combos',       name: 'Combos',       order: 5 },
];

const productsData = [
  // --- PASTA ---
  {
    slug: 'chicken-creamy-pasta',
    name: 'Chicken Creamy Pasta',
    category: 'pasta',
    price: 500,
    badge: 'Popular',
    description: 'Rich, comforting white creamy sauce tossed with juicy seasoned chicken chunks, Italian herbs, and elbow macaroni served hot in an aluminum foil tray.',
    image: '/images/pasta/chicken-creamy-pasta.webp',
    fallbackImage: '/images/pasta/chicken-creamy-pasta.png',
    alt: 'Chicken Creamy Pasta with elbow macaroni in aluminum foil tray - A2 Cravings Rawalpindi',
  },
  {
    slug: 'chicken-cheese-creamy-pasta',
    name: 'Chicken Cheese Creamy Pasta',
    category: 'pasta',
    price: 600,
    badge: 'Chef Special',
    description: 'Velvety cream sauce loaded with tender chicken chunks, smothered in golden melted mozzarella cheese over elbow macaroni in an aluminum foil tray.',
    image: '/images/pasta/chicken-cheese-creamy-pasta.webp',
    fallbackImage: '/images/pasta/chicken-cheese-creamy-pasta.png',
    alt: 'Chicken Cheese Creamy Pasta with elbow macaroni in aluminum foil tray - A2 Cravings Rawalpindi',
  },
  {
    slug: 'spicy-chicken-cheese-pasta',
    name: 'Spicy Chicken Cheese Pasta',
    category: 'pasta',
    price: 600,
    badge: 'Hot & Spicy',
    description: 'A zesty kick of spicy seasoned chicken, orange-red spicy sauce, chili flakes, and molten cheese over elbow macaroni baked in an aluminum foil tray.',
    image: '/images/pasta/spicy-chicken-cheese-pasta.webp',
    fallbackImage: '/images/pasta/spicy-chicken-cheese-pasta.png',
    alt: 'Spicy Chicken Cheese Pasta with elbow macaroni, chili flakes and chicken in aluminum foil tray - A2 Cravings Rawalpindi',
  },
  {
    slug: 'white-sauce-pasta',
    name: 'White Sauce Pasta',
    category: 'pasta',
    price: 500,
    badge: '',
    description: 'Classic creamy white Alfredo sauce with grilled chicken chunks, melted cheese, black pepper and herbs over elbow macaroni in an aluminum foil tray.',
    image: '/images/pasta/white-sauce-pasta.webp',
    fallbackImage: '/images/pasta/white-sauce-pasta.png',
    alt: 'White Sauce Pasta with elbow macaroni, chicken and cheese in aluminum foil tray - A2 Cravings Rawalpindi',
  },
  {
    slug: 'a2-special-pasta',
    name: 'A2 Special Pasta',
    category: 'pasta',
    price: 650,
    badge: 'Chef Special',
    description: 'Our signature masterpiece packed with premium chicken, extra cheese blend, and secret spices.',
    image: '/images/pasta/a2-special-pasta.png',
    fallbackImage: '',
    alt: 'A2 Special Pasta - Signature homemade fast food Rawalpindi',
  },

  // --- BUNS ---
  {
    slug: 'chicken-filling-bun',
    name: 'Chicken Filling Bun',
    category: 'buns',
    price: 200,
    badge: '',
    description: 'Golden, soft baked bun stuffed generously with flavorful shredded chicken filling.',
    image: '/images/buns/chicken-filling-bun.png',
    fallbackImage: '',
    alt: 'Chicken Filling Bun - Fresh baked homemade bun Rawalpindi',
  },
  {
    slug: 'chicken-vegetable-filling-bun',
    name: 'Chicken + Vegetable Filling Bun',
    category: 'buns',
    price: 150,
    badge: '',
    description: 'Fresh warm bun filled with lightly spiced chicken and crunchy garden vegetables.',
    image: '/images/buns/chicken-vegetable-filling-bun.png',
    fallbackImage: '',
    alt: 'Chicken and Vegetable Stuffed Bun - A2 Cravings Rawalpindi',
  },
  {
    slug: 'chicken-cheese-filling-bun',
    name: 'Chicken Cheese Filling Bun',
    category: 'buns',
    price: 250,
    badge: 'Popular',
    description: 'Soft warm bun oozing with melted cheese and savory spiced chicken stuffing.',
    image: '/images/buns/chicken-cheese-filling-bun.webp',
    fallbackImage: '/images/buns/chicken-cheese-filling-bun.png',
    alt: 'Delicious homemade chicken cheese filling bun with melted cheese by A2 Cravings',
  },

  // --- LOADED FRIES ---
  {
    slug: 'chicken-loaded-fries',
    name: 'Chicken Loaded Fries',
    category: 'loaded-fries',
    price: 400,
    badge: '',
    description: 'Crispy golden fries smothered in seasoned chicken, house special sauces, and creamy mayo.',
    image: '/images/loaded-fries/chicken-loaded-fries.webp',
    fallbackImage: '/images/loaded-fries/chicken-loaded-fries.png',
    alt: 'Crispy golden French fries topped with juicy seasoned chicken and creamy sauces by A2 Cravings',
  },
  {
    slug: 'crispy-zinger-loaded-fries',
    name: 'Crispy Zinger Loaded Fries',
    category: 'loaded-fries',
    price: 500,
    badge: 'Hot Seller',
    description: 'Crunchy battered zinger chicken bites layered over hot fries with signature spicy drizzle.',
    image: '/images/loaded-fries/crispy-zinger-loaded-fries.png',
    fallbackImage: '',
    alt: 'Crispy Zinger Loaded Fries - Fast food favorite Rawalpindi',
  },
  {
    slug: 'a2-special-loaded-fries',
    name: 'A2 Special Loaded Fries',
    category: 'loaded-fries',
    price: 550,
    badge: 'Chef Special',
    description: 'The ultimate fries platter: loaded with double chicken, molten cheese, and chef dressings.',
    image: '/images/loaded-fries/a2-special-loaded-fries.png',
    fallbackImage: '',
    alt: 'A2 Special Loaded Fries - Ultimate loaded fries Rawalpindi',
  },

  // --- BIRYANI ---
  {
    slug: 'chicken-biryani',
    name: 'Chicken Biryani',
    category: 'biryani',
    price: 370,
    badge: 'Bestseller',
    description: 'Authentic homemade fragrant basmati rice layered with succulent spiced chicken and herbs.',
    image: '/images/biryani/chicken-biryani.png',
    fallbackImage: '',
    alt: 'Chicken Biryani - Traditional homemade chicken biryani Rawalpindi',
  },
  {
    slug: 'aalu-biryani',
    name: 'Aalu Biryani',
    category: 'biryani',
    price: 270,
    badge: '',
    description: 'Aromatic Karachi-style spiced biryani cooked with tender spiced potatoes and rich saffron aroma.',
    image: '/images/biryani/aalu-biryani.png',
    fallbackImage: '',
    alt: 'Aalu Biryani - Homemade authentic potato biryani Rawalpindi',
  },

  // --- COMBOS ---
  {
    slug: 'pasta-drink-combo',
    name: 'Pasta + Drink',
    category: 'combos',
    price: 700,
    badge: '',
    description: 'Enjoy any personal creamy pasta served with a chilled refreshing soft drink.',
    image: '/images/combos/pasta-drink-combo.png',
    fallbackImage: '',
    alt: 'Pasta and Drink Combo Deal - A2 Cravings fast food Rawalpindi',
  },
  {
    slug: 'biryani-drink-combo',
    name: 'Biryani + Drink',
    category: 'combos',
    price: 470,
    badge: '',
    description: 'A plate of delicious Chicken Biryani paired with a chilled soft drink.',
    image: '/images/combos/biryani-drink-combo.png',
    fallbackImage: '',
    alt: 'Chicken Biryani and Drink Deal - Rawalpindi food delivery',
  },
  {
    slug: 'aalu-biryani-drink-combo',
    name: 'Aalu Biryani + Drink',
    category: 'combos',
    price: 370,
    badge: '',
    description: 'Flavorful Aalu Biryani accompanied by your favorite chilled cold drink.',
    image: '/images/combos/aalu-biryani-drink-combo.png',
    fallbackImage: '',
    alt: 'Aalu Biryani with Drink Combo - A2 Cravings Rawalpindi',
  },
  {
    slug: 'loaded-fries-drink-combo',
    name: 'Loaded Fries + Drink',
    category: 'combos',
    price: 500,
    badge: '',
    description: 'Generous serving of crispy loaded fries served alongside a refreshing soft drink.',
    image: '/images/combos/loaded-fries-drink-combo.png',
    fallbackImage: '',
    alt: 'Loaded Fries and Drink Value Deal - Homemade food Rawalpindi',
  },
  {
    slug: 'siblings-combo',
    name: 'Siblings Combo',
    category: 'combos',
    price: 1400,
    badge: 'Family Value',
    description: '1 Chicken Cheese Pasta, 1 Chicken Biryani, 1 Fries, 2 Drinks.',
    image: '/images/combos/siblings-combo-deal.png',
    fallbackImage: '',
    alt: 'Siblings Combo Deal - 1 Chicken Cheese Pasta, 1 Chicken Biryani, 1 Fries, 2 Drinks',
  },
  {
    slug: 'extra-raita',
    name: 'Extra Raita',
    category: 'combos',
    price: 20,
    badge: '',
    description: 'Cool refreshing homemade herb and cumin raita dip.',
    image: '/images/biryani/extra-raita.png',
    fallbackImage: '',
    alt: 'Extra Raita Dip - A2 Cravings Rawalpindi',
  },
];

// ─── Seed Function ────────────────────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    let customUri = null;
    if (process.argv[2] === 'atlas' || process.argv[2] === 'prod') {
      customUri = process.env.MONGODB_URI || process.env.MONGO_URI_ATLAS;
      if (!customUri) {
        throw new Error('No production Atlas URI found in MONGODB_URI or MONGO_URI_ATLAS');
      }
      console.log('Targeting production MongoDB Atlas database...');
    }

    await connectDB(customUri);

    // Clear existing data to avoid duplicates
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing categories and products');

    // Insert categories
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Insert products
    const insertedProducts = await Product.insertMany(productsData);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('Categories:', insertedCategories.map(c => c.name).join(', '));
    console.log('Products:', insertedProducts.length, 'items');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
