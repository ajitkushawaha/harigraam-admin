import React, { useEffect, useState } from 'react';
import brandLogo from '../assets/logo.png';
import heroBg from '../assets/landing_hero.jpg';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { ShoppingBag, ShieldCheck, Truck, Store, Smartphone, Star } from 'lucide-react';
import './LandingPage.css';

type Category = {
  id: string;
  name: string;
  image?: string;
};

type Product = {
  id: string;
  name: string;
  image?: string;
  price: number;
  description?: string;
};

const LandingPage = () => {
  const token = useAuthStore(state => state.token);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/categories').catch(() => ({ data: [] })),
      api.get('/products').catch(() => ({ data: [] })),
    ]).then(([catRes, prodRes]) => {
      setCategories(catRes.data?.slice(0, 10) || []);
      setProducts(prodRes.data?.slice(0, 8) || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="landing-layout">
      {/* Navigation TopBar */}
      <header className="landing-header">
        <div className="landing-logo-container">
          <img src={brandLogo} alt="Haritgraam Logo" className="landing-logo" />
        </div>
        <div className="landing-nav-actions">
          <a href={token ? "/admin" : "/login"} className="landing-admin-btn">
            {token ? "Admin Dashboard" : "Merchant Panel"}
          </a>
        </div>
      </header>

      {/* Hero Banner Grid Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={16} fill="#b45309" /> Direct From Village Farms
          </div>
          
          <h1 className="hero-title">
            Purely Fresh.<br />
            Locally Sourced.
          </h1>
          
          <p className="hero-subtitle">
            Discover the finest organic vegetables, farm-fresh milk, raw honey, and traditional local sweets delivered to your door in just 15 minutes.
          </p>

          {/* App download CTA row */}
          <div className="hero-cta-container">
            <a href="/haritgram-app.apk" download="haritgram-app.apk" className="download-app-btn">
              <Smartphone size={20} />
              <div>
                <span className="download-app-subtitle">Download App</span>
                Android APK
              </div>
            </a>
          </div>
        </div>

        {/* Hero Banner Visual Visual */}
        <div 
          className="hero-visual" 
          style={{ backgroundImage: `url(${heroBg})` }} 
        />
      </section>

      {/* Advantages Banner Grid */}
      <section className="advantages-section">
        <h2 className="section-title">
          Why Choose Haritgraam?
        </h2>
        
        <div className="advantages-grid">
          <div className="advantage-card">
            <div className="advantage-icon-wrapper">
              <ShieldCheck size={28} />
            </div>
            <h3 className="advantage-title">Direct Farm Sourcing</h3>
            <p className="advantage-desc">We eliminate middle-men. Produce goes directly from the field to our regional packaging centers to guarantee top freshness.</p>
          </div>

          <div className="advantage-card">
            <div className="advantage-icon-wrapper">
              <Truck size={28} />
            </div>
            <h3 className="advantage-title">Hyperlocal 15-Min Delivery</h3>
            <p className="advantage-desc">Our localized delivery partners are positioned at regional hubs to fulfill and ship your grocery requests immediately.</p>
          </div>

          <div className="advantage-card">
            <div className="advantage-icon-wrapper">
              <Store size={28} />
            </div>
            <h3 className="advantage-title">Empowering Rural Economy</h3>
            <p className="advantage-desc">Every local grocery item purchased directly transfers revenue and economic growth back to small independent growers.</p>
          </div>
        </div>
      </section>

      {/* Dynamic Shop by Category Section */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="categories-container">
            <h2 className="categories-section-title">Explore Our Categories</h2>
            <div className="categories-grid">
              {categories.map(cat => (
                <div key={cat.id} className="category-card">
                  <div className="category-image-wrapper">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="category-image" />
                    ) : (
                      <div className="category-icon-placeholder"><ShoppingBag size={32} /></div>
                    )}
                  </div>
                  <span className="category-name">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Products Showcase Section */}
      {products.length > 0 && (
        <section className="products-section">
          <div className="products-container">
            <h2 className="categories-section-title">Bestsellers on Haritgraam</h2>
            <div className="products-grid">
              {products.map(prod => (
                <div key={prod.id} className="product-card">
                  <div className="product-image-wrapper">
                    {prod.image ? (
                      <img src={prod.image} alt={prod.name} className="product-image" />
                    ) : (
                      <div className="product-icon-placeholder"><ShoppingBag size={48} /></div>
                    )}
                  </div>
                  <div className="product-info">
                    <div>
                      <h4 className="product-name">{prod.name}</h4>
                      <p className="product-desc">{prod.description || 'Farm-fresh grocery product.'}</p>
                    </div>
                    <div className="product-price-row">
                      <span className="product-price">₹{prod.price}</span>
                      <span className="product-badge">100% Fresh</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer Info Section */}
      <footer className="landing-footer">
        <div className="footer-container">
          <img src={brandLogo} alt="Haritgraam Logo" className="footer-logo" />
          <h3 className="footer-title">Haritgraam</h3>
          <p className="footer-desc">
            Connecting small-scale rural farmers directly to you, promoting local agriculture, organic food, and sustainable delivery systems.
          </p>
          <div className="footer-divider" />
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Haritgraam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
