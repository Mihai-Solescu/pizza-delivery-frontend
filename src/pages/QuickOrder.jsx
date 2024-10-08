import { useState } from 'react';
import { Link } from 'react-router-dom';
import './QuickOrder.css'; // Custom styles for pizza card

function QuickOrder() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="quick-page">
      <header>
        <div className="top-bar">
            <div className="top-left">
                <div className="hamburger-menu">
                    <div className="menu-icon" onClick={toggleMenu}>
                        ☰
                    </div>
                    {menuOpen && (
                        <div className="menu-content">
                            <Link to="/account">Account</Link>
                            <Link to="/settings">Settings</Link>
                            <Link to="/preferences">Preferences</Link>
                        </div>
                    )}
                </div>
                {/* Shopping Cart Icon */}
                <div className="shopping-cart">
                    <Link to="/cart">🛒</Link>
                </div>
                <div className="username">{localStorage.getItem("userName")}</div>
            </div>

            <div className="nav-buttons">
                <Link to="/normalorder" className="nav-btn-normal">Normal</Link>
                <Link to="/quickorder" className="nav-btn-quick">Quick</Link>
            </div>
        </div>
      </header>
    </div>
  );
}

export default QuickOrder;