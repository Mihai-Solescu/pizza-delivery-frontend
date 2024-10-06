import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PizzaItem from '../components/PizzaItem'; // Reusing the PizzaItem component
import './NormalOrder.css'; // Custom styles

function NormalOrder() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const pizzaData = [
    { name: 'Margherita', price: 10, image: '/path-to-pizza-image.jpg', description: 'Classic pizza with tomatoes and mozzarella.', ingredients: ['Tomatoes', 'Mozzarella'], reviews: ['Great pizza!', 'Loved the taste!'] },
    { name: 'Pepperoni', price: 12, image: '/path-to-pizza-image.jpg', description: 'Pizza with pepperoni and cheese.', ingredients: ['Pepperoni', 'Cheese'], reviews: ['My favorite!', 'Delicious!'] }
    // Add more pizzas as needed
  ];

  return (
    <div className="normal-order-page">
      {/* Hamburger menu */}
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

      {/* User info and shopping cart */}
      <div className="header">
        <div className="username">Username</div>
        <div className="shopping-cart">
          <Link to="/cart">🛒</Link>
        </div>
      </div>

      {/* Pizza list */}
      <div className="pizza-list">
        {pizzaData.map((pizza, index) => (
          <PizzaItem key={index} pizza={pizza} />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="bottom-nav">
        <Link to="/normalorder" className="nav-btn">Normal</Link>
        <Link to="/quickorder" className="nav-btn">Quick</Link>
      </div>
    </div>
  );
}

export default NormalOrder;
