import React, { useEffect, useState } from 'react';
import brandLogo from '../assets/logo.png';
import heroBg from '../assets/landing_hero.jpg';
import { api } from '../lib/api';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Store, Smartphone, Star, PlayCircle, AppWindow } from 'lucide-react';

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
    <div className="landing-layout" style={{ fontFamily: 'Outfit, Inter, sans-serif', color: '#1f2937', backgroundColor: '#fffdf9' }}>
      {/* Navigation TopBar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 30px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f3f4f6',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={brandLogo} alt="Haritgraam Logo" style={{ width: '164px', objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="/login" style={{
            padding: '0.65rem 1.5rem',
            borderRadius: '999px',
            backgroundColor: '#d97706',
            color: '#ffffff',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.15)',
            transition: 'all 0.2s'
          }}>
            Merchant Panel
          </a>
        </div>
      </header>

      {/* Hero Banner Grid Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        minHeight: '80vh',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem 5%',
          backgroundColor: '#fffbeb'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#fef3c7',
            color: '#b45309',
            padding: '0.5rem 1.25rem',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '0.85rem',
            width: 'fit-content',
            marginBottom: '2rem'
          }}>
            <Star size={16} fill="#b45309" /> Direct From Village Farms
          </div>
          
          <h1 style={{
            fontSize: '3.75rem',
            fontWeight: 900,
            color: '#451a03',
            lineHeight: '1.1',
            marginBottom: '1.5rem',
            letterSpacing: '-1.5px'
          }}>
            Purely Fresh.<br />
            Locally Sourced.
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#4b5563',
            lineHeight: '1.6',
            marginBottom: '2.5rem',
            maxWidth: '540px'
          }}>
            Discover the finest organic vegetables, farm-fresh milk, raw honey, and traditional local sweets delivered to your door in just 15 minutes.
          </p>

          {/* App download CTA row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#451a03',
              color: '#ffffff',
              padding: '1rem 2rem',
              borderRadius: '16px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '1.05rem',
              boxShadow: '0 8px 24px rgba(69, 26, 3, 0.2)'
            }}>
              <Smartphone size={20} />
              <div>
                <span style={{ fontSize: '0.75rem', display: 'block', opacity: 0.7, fontWeight: 500 }}>Download App</span>
                Android APK
              </div>
            </a>
          </div>
        </div>

        {/* Hero Banner Visual Visual */}
        <div style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px'
        }} />
      </section>

      {/* Advantages Banner Grid */}
      <section style={{
        padding: '5rem 5%',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#451a03', textAlign: 'center', marginBottom: '4rem' }}>
          Why Choose Haritgraam?
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid #fde68a', boxShadow: '0 4px 20px rgba(217, 119, 6, 0.03)' }}>
            <div style={{ backgroundColor: '#fef3c7', color: '#d97706', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#451a03', marginBottom: '0.75rem' }}>Direct Farm Sourcing</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>We eliminate middle-men. Produce goes directly from the field to our regional packaging centers to guarantee top freshness.</p>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid #fde68a', boxShadow: '0 4px 20px rgba(217, 119, 6, 0.03)' }}>
            <div style={{ backgroundColor: '#fef3c7', color: '#d97706', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Truck size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#451a03', marginBottom: '0.75rem' }}>Hyperlocal 15-Min Delivery</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>Our localized delivery partners are positioned at regional hubs to fulfill and ship your grocery requests immediately.</p>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid #fde68a', boxShadow: '0 4px 20px rgba(217, 119, 6, 0.03)' }}>
            <div style={{ backgroundColor: '#fef3c7', color: '#d97706', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Store size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#451a03', marginBottom: '0.75rem' }}>Empowering Rural Economy</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>Every local grocery item purchased directly transfers revenue and economic growth back to small independent growers.</p>
          </div>
        </div>
      </section>

      {/* Dynamic Shop by Category Section */}
      {categories.length > 0 && (
        <section style={{ padding: '5rem 5%', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#451a03', marginBottom: '3rem' }}>Explore Our Categories</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '1.5rem'
            }}>
              {categories.map(cat => (
                <div key={cat.id} style={{
                  backgroundColor: '#fffbeb',
                  borderRadius: '20px',
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  border: '1px solid #fde68a',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.01)'
                }}>
                  <div style={{ width: '96px', height: '96px', margin: '0 auto 1rem', borderRadius: '50%', backgroundColor: '#fff', overflow: 'hidden', border: '1px solid #fde68a' }}>
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}><ShoppingBag size={32} /></div>
                    )}
                  </div>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#451a03', display: 'block' }}>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Products Showcase Section */}
      {products.length > 0 && (
        <section style={{ padding: '5rem 5%', borderTop: '1px solid #e5e7eb', backgroundColor: '#fffdf9' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#451a03', marginBottom: '3rem' }}>Bestsellers on Haritgraam</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {products.map(prod => (
                <div key={prod.id} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: '1px solid #fde68a',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ height: '200px', backgroundColor: '#fafafa', position: 'relative' }}>
                    {prod.image ? (
                      <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}><ShoppingBag size={48} /></div>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#451a03', marginBottom: '0.5rem' }}>{prod.name}</h4>
                      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.5' }}>{prod.description || 'Farm-fresh grocery product.'}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#d97706' }}>₹{prod.price}</span>
                      <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700, backgroundColor: '#fef3c7', padding: '0.35rem 0.75rem', borderRadius: '999px' }}>100% Fresh</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer Info Section */}
      <footer style={{
        backgroundColor: '#451a03',
        color: '#ffffff',
        padding: '5rem 5% 4rem',
        textAlign: 'center',
        borderTop: '5px solid #d97706'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <img src={brandLogo} alt="Haritgraam Logo" style={{ height: '70px', objectFit: 'contain', marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Haritgraam</h3>
          <p style={{ color: '#fde68a', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: '1.6', opacity: 0.9 }}>
            Connecting small-scale rural farmers directly to you, promoting local agriculture, organic food, and sustainable delivery systems.
          </p>
          <div style={{ width: '80px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 auto 2.5rem' }} />
          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.4)' }}>&copy; {new Date().getFullYear()} Haritgraam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
