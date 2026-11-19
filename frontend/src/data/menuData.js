export const menuCategories = [
  { id: 'all', name: 'All' },
  { id: 'pasta', name: 'Pasta' },
  { id: 'buns', name: 'Buns' },
  { id: 'loaded-fries', name: 'Loaded Fries' },
  { id: 'biryani', name: 'Biryani' },
  { id: 'combos', name: 'Combos' }
];

export const menuItems = [
  // --- PASTA ---
  {
    id: 'chicken-cheese-creamy-pasta',
    name: 'Chicken Cheese Creamy Pasta',
    category: 'pasta',
    price: 600,
    description: 'Velvety cream sauce loaded with tender chicken chunks, topped with melted mozzarella cheese.',
    image: '/images/pasta/chicken-cheese-creamy-pasta.png',
    alt: 'Chicken Cheese Creamy Pasta - Homemade fast food in Rawalpindi by A2 Cravings'
  },
  {
    id: 'chicken-creamy-pasta',
    name: 'Chicken Creamy Pasta',
    category: 'pasta',
    price: 500,
    description: 'Rich, comforting white creamy pasta tossed with juicy seasoned chicken and Italian herbs.',
    image: '/images/pasta/chicken-creamy-pasta.png',
    alt: 'Creamy Chicken Pasta - A2 Cravings homemade food in Rawalpindi'
  },
  {
    id: 'spicy-chicken-cheese-pasta',
    name: 'Spicy Chicken Cheese Pasta',
    category: 'pasta',
    price: 600,
    description: 'A zesty kick of spicy seasoned chicken, molten cheese, and rich creamy pasta sauce.',
    image: '/images/pasta/spicy-chicken-cheese-pasta.png',
    alt: 'Spicy Chicken Cheese Pasta - Fresh homemade pasta Rawalpindi'
  },
  {
    id: 'white-sauce-pasta',
    name: 'White Sauce Pasta',
    category: 'pasta',
    price: 500,
    description: 'Classic velvety garlic-infused béchamel sauce pasta cooked to al dente perfection.',
    image: '/images/pasta/white-sauce-pasta.png',
    alt: 'White Sauce Pasta - Delicious homemade food Rawalpindi'
  },
  {
    id: 'a2-special-pasta',
    name: 'A2 Special Pasta',
    category: 'pasta',
    price: 650,
    badge: 'Chef Special',
    description: 'Our signature masterpiece packed with premium chicken, extra cheese blend, and secret spices.',
    image: '/images/pasta/a2-special-pasta.png',
    alt: 'A2 Special Pasta - Signature homemade fast food Rawalpindi'
  },

  // --- BUNS ---
  {
    id: 'chicken-filling-bun',
    name: 'Chicken Filling Bun',
    category: 'buns',
    price: 200,
    description: 'Golden, soft baked bun stuffed generously with flavorful shredded chicken filling.',
    image: '/images/buns/chicken-filling-bun.png',
    alt: 'Chicken Filling Bun - Fresh baked homemade bun Rawalpindi'
  },
  {
    id: 'chicken-vegetable-filling-bun',
    name: 'Chicken + Vegetable Filling Bun',
    category: 'buns',
    price: 150,
    description: 'Fresh warm bun filled with lightly spiced chicken and crunchy garden vegetables.',
    image: '/images/buns/chicken-vegetable-filling-bun.png',
    alt: 'Chicken and Vegetable Stuffed Bun - A2 Cravings Rawalpindi'
  },
  {
    id: 'chicken-cheese-filling-bun',
    name: 'Chicken Cheese Filling Bun',
    category: 'buns',
    price: 250,
    badge: 'Popular',
    description: 'Soft warm bun oozing with melted cheese and savory spiced chicken stuffing.',
    image: '/images/buns/chicken-cheese-filling-bun.webp',
    fallbackImage: '/images/buns/chicken-cheese-filling-bun.png',
    alt: 'Delicious homemade chicken cheese filling bun with melted cheese by A2 Cravings'
  },

  // --- LOADED FRIES ---
  {
    id: 'chicken-loaded-fries',
    name: 'Chicken Loaded Fries',
    category: 'loaded-fries',
    price: 400,
    description: 'Crispy golden fries smothered in seasoned chicken, house special sauces, and creamy mayo.',
    image: '/images/loaded-fries/chicken-loaded-fries.webp',
    fallbackImage: '/images/loaded-fries/chicken-loaded-fries.png',
    alt: 'Crispy golden French fries topped with juicy seasoned chicken and creamy sauces by A2 Cravings'
  },
  {
    id: 'crispy-zinger-loaded-fries',
    name: 'Crispy Zinger Loaded Fries',
    category: 'loaded-fries',
    price: 500,
    badge: 'Hot Seller',
    description: 'Crunchy battered zinger chicken bites layered over hot fries with signature spicy drizzle.',
    image: '/images/loaded-fries/crispy-zinger-loaded-fries.png',
    alt: 'Crispy Zinger Loaded Fries - Fast food favorite Rawalpindi'
  },
  {
    id: 'a2-special-loaded-fries',
    name: 'A2 Special Loaded Fries',
    category: 'loaded-fries',
    price: 550,
    badge: 'Chef Special',
    description: 'The ultimate fries platter: loaded with double chicken, molten cheese, and chef dressings.',
    image: '/images/loaded-fries/a2-special-loaded-fries.png',
    alt: 'A2 Special Loaded Fries - Ultimate loaded fries Rawalpindi'
  },

  // --- BIRYANI ---
  {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    category: 'biryani',
    price: 370,
    badge: 'Bestseller',
    description: 'Authentic homemade fragrant basmati rice layered with succulent spiced chicken and herbs.',
    image: '/images/biryani/chicken-biryani.png',
    alt: 'Chicken Biryani - Traditional homemade chicken biryani Rawalpindi'
  },
  {
    id: 'aalu-biryani',
    name: 'Aalu Biryani',
    category: 'biryani',
    price: 270,
    description: 'Aromatic Karachi-style spiced biryani cooked with tender spiced potatoes and rich saffron aroma.',
    image: '/images/biryani/aalu-biryani.png',
    alt: 'Aalu Biryani - Homemade authentic potato biryani Rawalpindi'
  },

  // --- COMBOS ---
  {
    id: 'pasta-drink-combo',
    name: 'Pasta + Drink',
    category: 'combos',
    price: 700,
    description: 'Enjoy any personal creamy pasta served with a chilled refreshing soft drink.',
    image: '/images/combos/pasta-drink-combo.png',
    alt: 'Pasta and Drink Combo Deal - A2 Cravings fast food Rawalpindi'
  },
  {
    id: 'biryani-drink-combo',
    name: 'Biryani + Drink',
    category: 'combos',
    price: 470,
    description: 'A plate of delicious Chicken Biryani paired with a chilled soft drink.',
    image: '/images/combos/biryani-drink-combo.png',
    alt: 'Chicken Biryani and Drink Deal - Rawalpindi food delivery'
  },
  {
    id: 'aalu-biryani-drink-combo',
    name: 'Aalu Biryani + Drink',
    category: 'combos',
    price: 370,
    description: 'Flavorful Aalu Biryani accompanied by your favorite chilled cold drink.',
    image: '/images/combos/aalu-biryani-drink-combo.png',
    alt: 'Aalu Biryani with Drink Combo - A2 Cravings Rawalpindi'
  },
  {
    id: 'loaded-fries-drink-combo',
    name: 'Loaded Fries + Drink',
    category: 'combos',
    price: 500,
    description: 'Generous serving of crispy loaded fries served alongside a refreshing soft drink.',
    image: '/images/combos/loaded-fries-drink-combo.png',
    alt: 'Loaded Fries and Drink Value Deal - Homemade food Rawalpindi'
  },
  {
    id: 'siblings-combo',
    name: 'Siblings Combo',
    category: 'combos',
    price: 1400,
    badge: 'Family Value',
    description: '1 Chicken Cheese Pasta, 1 Chicken Biryani, 1 Fries, 2 Drinks.',
    image: '/images/combos/siblings-combo-deal.png',
    alt: 'Siblings Combo Deal - 1 Chicken Cheese Pasta, 1 Chicken Biryani, 1 Fries, 2 Drinks'
  },
  {
    id: 'extra-raita',
    name: 'Extra Raita',
    category: 'combos',
    price: 20,
    description: 'Cool refreshing homemade herb and cumin raita dip.',
    image: '/images/biryani/extra-raita.png',
    alt: 'Extra Raita Dip - A2 Cravings Rawalpindi'
  }
];
