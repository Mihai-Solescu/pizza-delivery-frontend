import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css';  // Assuming you'll create this CSS file for styling
import { Link } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);  // Items in the cart
  const [drinks, setDrinks] = useState([]);        // Drinks list from server
  const [desserts, setDesserts] = useState([]);    // Desserts list from server
  const [totalPrice, setTotalPrice] = useState(0); // Total cart price
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch cart items and calculate total price
  useEffect(() => {
    async function fetchCartItems() {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://localhost:8000/orders/items/', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setCartItems(response.data);
        calculateTotal(response.data);
      } catch (error) {
        console.log('Failed to fetch cart items', error);
        alert('Failed to load cart items. Please try again.');
      }
    }
  
    fetchCartItems();
  }, []);
  

  // Fetch drinks and desserts from the server
  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/menu/drinklist/');
        setDrinks(response.data);
      } catch (error) {
        console.log('Failed to fetch drinks', error);
      }
    };

    const fetchDesserts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/menu/dessertlist/');
        setDesserts(response.data);
      } catch (error) {
        console.log('Failed to fetch desserts', error);
      }
    };

    fetchDrinks();
    fetchDesserts();
  }, []);

  // Calculate total price based on cart items
  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Increase quantity of an item
  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  // Decrease quantity of an item
  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    }
  };

  // Confirm Order
  const handleConfirmOrder = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post('http://localhost:8000/order/finalize/', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      alert('Order Confirmed!');
    } catch (error) {
      console.log('Failed to confirm order', error);
    }
  };

  return (
      <div className="cart-page">
        {/* Top bar with username and navigation */}
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
            <div className="shopping-cart">
              <Link to="/cart">🛒</Link>
            </div>
            <div className="username">{localStorage.getItem("userName")}</div>
          </div>
          <div className="nav-buttons">
            <Link to="/normalorder" className="nav-btn">Normal</Link>
            <Link to="/quickorder" className="nav-btn">Quick</Link>
          </div>
        </div>

        {/* Cart Items */}
        <div className="cart-section">
          <h2>Items in Your Cart</h2>
          {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src="https://via.placeholder.com/100" alt={item.name} className="item-image"/>
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>{(item.price * item.quantity).toFixed(2)} €</p>
                  <div className="quantity-control">
                    <button onClick={() => decreaseQuantity(index)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(index)}>+</button>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Drinks Section */}
        <div className="drinks-section">
          <h2>Would you like drinks?</h2>
          {drinks.map((drink, index) => (
              <div key={index} className="cart-item">
                <img src="https://via.placeholder.com/100" alt={drink.name} className="item-image"/>
                <div className="item-info">
                  <h3>{drink.name}</h3>
                  <p>{drink.price} €</p>
                  <button>Add to Cart</button>
                </div>
              </div>
          ))}
        </div>

        {/* Desserts Section */}
        <div className="desserts-section">
          <h2>Would you like desserts?</h2>
          {desserts.map((dessert, index) => (
              <div key={index} className="cart-item">
                <img src="https://via.placeholder.com/100" alt={dessert.name} className="item-image"/>
                <div className="item-info">
                  <h3>{dessert.name}</h3>
                  <p>{dessert.price} €</p>
                  <button>Add to Cart</button>
                </div>
              </div>
          ))}
        </div>

        {/* Total and Confirm Order */}
        <div className="total-section">
          <h2>Total: {totalPrice.toFixed(2)} €</h2>
          <button className="confirm-order-btn" onClick={handleConfirmOrder}>Confirm Order</button>
        </div>
      </div>
  );
}

export default CartPage;
