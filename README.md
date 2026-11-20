# A2 CRAVINGS

> **Homemade Fast Food Crafted With Passion**  
> Authentic homemade-style fast food in Rawalpindi, Pakistan — freshly cooked pastas, loaded fries, stuffed buns, flavorful biryani, and value combos.

---

## 🍽️ About the Project

**A2 CRAVINGS** is a modern, high-performance web application designed for a premier homemade fast-food brand operating in Rawalpindi. The website delivers a luxury dining brand experience with a signature black, orange, and white theme, smooth animations, an interactive cart system, and seamless WhatsApp ordering integration.

---

## 🚀 Technologies Used

- **Frontend Framework:** React 18.3 (`react`, `react-dom`)
- **Build Tool:** Vite 6
- **Icons:** FontAwesome 7 (`@fortawesome/react-fontawesome`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-brands-svg-icons`)
- **Styling:** Vanilla CSS3 (Custom Properties, Flexbox, CSS Grid, Glassmorphism, 3D CSS Transforms, KaTeX-free responsive typography)
- **Routing:** Lightweight client-side SPA router utilizing HTML5 History API (`pushState` / `popstate`)
- **State Management:** React Context API (`CartContext`, `ThemeContext`) with `localStorage` persistence

---

## 📦 Features & Capabilities

### 1. Navigation & Header
- Sticky glassmorphic navbar with smooth scroll tracking
- Responsive mobile drawer navigation with background scroll-lock
- Real-time cart item count badge
- One-click Dark / Light theme toggle with zero flash of unstyled content (FOUC)

### 2. Interactive Menu
- 19 handcrafted dishes across 6 categories:
  - **Pastas:** Crafted with elbow macaroni in heat-retaining aluminum foil trays
  - **Buns:** Stuffed with chicken and cheese
  - **Loaded Fries:** Golden fries smothered in seasoned chicken and signature sauces
  - **Biryani:** Authentic Karachi-style chicken and aalu biryani
  - **Combos:** Value meal pairings with chilled drinks
- 4:3 ratio food photography with modern `.webp` format and `.png` fallbacks
- Equal-height product cards with 3D tilt effects
- Dedicated "Add to Cart" action buttons

### 3. Cart & WhatsApp Checkout System
- Slide-over cart drawer with animated open/close transitions
- Real-time quantity adjustments, item removals, and subtotal calculation
- Delivery details form with validation (Customer Name, Phone Number, Full Address, Special Notes)
- Form state auto-saved in `localStorage`
- One-click order dispatch to kitchen WhatsApp with a pre-filled, structured itemized bill

### 4. Brand & Storytelling
- Cinematic hero section with interactive 3D floating food composition
- Homepage "About Us" section highlighting freshly prepared meals and local Rawalpindi kitchen roots
- Direct contact options and customer inquiry forms

### 5. Policy & Help Pages
Complete standalone policy pages featuring professional headers, breadcrumbs, and `← Back to Home` navigation:
- **Privacy Policy** (`/privacy-policy`)
- **Terms & Conditions** (`/terms-and-conditions`)
- **Shipping & Delivery Policy** (`/shipping-and-delivery`)
- **Return, Refund & Cancellation Policy** (`/refund-policy`)
- **Frequently Asked Questions (FAQ)** (`/faq`) with interactive search and category accordions
- **Contact Us** (`/contact-us`) with direct kitchen links

### 6. Responsive Design & Accessibility
- Fully responsive across all device breakpoints (375px mobile, 430px modern mobile, 768px tablet, 1024px laptop, 1440px desktop)
- Zero horizontal overflow
- Strict adherence to accessible semantic HTML and ARIA labels

---

## 💻 Installation & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v9 or higher)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abeera-dev76/a2-cravings.git
   cd a2-cravings
   ```

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

5. **Build for production:**
   ```bash
   npm run build
   ```
   Production assets will be built into `frontend/dist/`.

---

## 📄 License

All rights reserved © 2026 A2 CRAVINGS.
