import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import MenuSection from '../sections/MenuSection';
import ComboDeals from '../sections/ComboDeals';
import AboutSection from '../sections/AboutSection';
import WhyChooseUs from '../sections/WhyChooseUs';
import ContactSection from '../sections/ContactSection';
import Footer from '../components/Footer';

export const Home = () => {
  return (
    <div className="a2-page-wrapper">
      <Navbar />
      <main id="main-content">
        <section id="home">
          <Hero />
        </section>

        {/* STEP 5: Food Menu Section */}
        <MenuSection />

        {/* STEP 6: Combo Deals & Special Offers Section */}
        <ComboDeals />

        {/* STEP 7: Our Story / About Us Section */}
        <AboutSection />

        {/* STEP 8: Why Choose Us Section */}
        <WhyChooseUs />

        {/* STEP 9: Contact Us & Quick Order Form Section */}
        <ContactSection />
      </main>

      {/* STEP 10: Luxury Restaurant Footer */}
      <Footer />
    </div>
  );
};

export default Home;
