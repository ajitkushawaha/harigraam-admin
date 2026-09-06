import { useState, useRef, useEffect } from 'react';
import {
  Image,
  KeyRound,
  LayoutDashboard,
  MapPin,
  Paintbrush,
  Package,
  ReceiptText,
  Store,
  Tags,
  Truck,
  Users,
  WalletCards,
  UserCircle,
  Menu,
  X,
  Settings,
  Ticket,
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import brandLogo from '../assets/logo.png';

const navGroups = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    section: 'Business Structure',
    items: [
      { label: 'Vendors (Brands)', path: '/vendors', icon: Store, superAdminOnly: true },
      { label: 'Branches (Stores)', path: '/branches', icon: MapPin },
    ]
  },
  {
    section: 'Catalog',
    items: [
      { label: 'Categories', path: '/categories', icon: Tags, superAdminOnly: true },
      { label: 'Products', path: '/products', icon: Package },
    ]
  },
  {
    section: 'Operations',
    items: [
      { label: 'Orders', path: '/orders', icon: ReceiptText },
      { label: 'Delivery Partners', path: '/delivery-partners', icon: Truck },
      { label: 'Coupons', path: '/coupons', icon: Ticket },
      { label: 'Customers', path: '/customers', icon: Users, superAdminOnly: true },
      { label: 'Payments', path: '/payments', icon: WalletCards, superAdminOnly: true },
    ]
  },
  {
    section: 'Settings & UI',
    items: [
      { label: 'Banners', path: '/banners', icon: Image },
      { label: 'Themes', path: '/themes', icon: Paintbrush, superAdminOnly: true },
      { label: 'Admin Users', path: '/admin-users', icon: KeyRound, superAdminOnly: true },
      { label: 'Notifications', path: '/settings/notifications', icon: Settings, superAdminOnly: true },
    ]
  }
];

const DashboardLayout = () => {
  const admin = useAuthStore(state => state.admin);
  const logout = useAuthStore(state => state.logout);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const confirmLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      {/* Mobile overlay backdrop */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-block">
          {/* <img className="brand-mark brand-logo" src={brandLogo} alt="Haritgraam" /> */}
          <div style={{ flex: 1 }}>
            <p className="brand-title">Haritgraam</p>
            <p className="brand-subtitle">Admin Console</p>
          </div>
          <button
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navGroups.map(group => {
            const visibleItems = group.items.filter(item => !item.superAdminOnly || admin?.role === 'super_admin');
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.section} style={{ marginBottom: 16 }}>
                <p className="nav-section-label">{group.section}</p>
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/admin'}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                      }>
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="main-panel">
        <div className="main-panel-content">
          <header className="topbar">
            <div className="topbar-left">
              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={28} color="#fff" />
              </button>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {admin?.role && (
                  <span style={{
                    marginLeft: 12,
                    padding: '4px 8px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 6,
                    fontSize: 12,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  letterSpacing: 0.5
                }}>
                  {admin.role.replace('_', ' ')}
                </span>
              )}
              </div>
              
            </div>
            <div className="topbar-actions">

              <div className="profile-menu-container" ref={menuRef}>
                <button
                  className="profile-icon-button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <UserCircle size={28} />
                </button>

                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <strong>{admin?.role === 'vendor_owner' ? 'Vendor' : 'Super Admin'}</strong>
                      <span>{admin?.email || 'admin'}</span>
                    </div>
                    <button className="profile-dropdown-item text-danger" onClick={confirmLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
          <div className="outlet-panel">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
