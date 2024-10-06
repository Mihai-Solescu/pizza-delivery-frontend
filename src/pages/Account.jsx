import { useState } from 'react';
import './Account.css';
import { Link } from "react-router-dom";

const Account = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Dummy data to simulate registration information
  const userInfo = {
    username: "JohnDoe",
    email: "johndoe@example.com",
    address: "123 Pizza Street, Food City",
    phone: "123-456-7890",
  };

  return (
    <div className="account-wrapper"> {/* Added wrapper div */}
      <div className="account-page">
        {/* Header with user info and hamburger menu */}
        <div className="header">
          <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
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
          <div className="username">{userInfo.username}</div>
          <div className="shopping-cart">
            <Link to="/cart">🛒</Link>
          </div>
        </div>

        {/* Displaying user information */}
        <div className="user-info">
          <h2>User Information</h2>
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Address:</strong> {userInfo.address}</p>
          <p><strong>Phone Number:</strong> {userInfo.phone}</p>
        </div>

        {/* Navigation buttons moved to footer */}
        <div className="bottom-nav">
          <Link to="/normalorder" className="nav-btn">Normal</Link>
          <Link to="/quickorder" className="nav-btn">Quick</Link>
        </div>
      </div>
    </div>
  );
};

export default Account;
