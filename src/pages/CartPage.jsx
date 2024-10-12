import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css';  // Assuming you'll create this CSS file for styling
import { Link } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState({ pizzas: [], drinks: [], desserts: [] }); // Initialize cartItems as an object with arrays
  const [drinks, setDrinks] = useState([]);        
  const [desserts, setDesserts] = useState([]);    
  const [totalPrice, setTotalPrice] = useState(0); 

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
        console.log('Fetched cart items', response.data);
        setCartItems(response.data);
        calculateTotal(response.data); // Calculate total price
      } catch (error) {
        console.log('Failed to fetch cart items', error);
      }
    }

    fetchCartItems();
  }, []);

  // Calculate total price based on cart items
  const calculateTotal = (items) => {
    const total = [...items.pizzas, ...items.drinks, ...items.desserts].reduce(
      (acc, item) => acc + item[item.content_type].price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  // Increase quantity of an item
  const increaseQuantity = (index, type) => {
    const updatedCart = { ...cartItems };
    updatedCart[type][index].quantity += 1;
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  // Decrease quantity of an item
  const decreaseQuantity = (index, type) => {
    const updatedCart = { ...cartItems };
    if (updatedCart[type][index].quantity > 1) {
      updatedCart[type][index].quantity -= 1;
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
            <div className="menu-icon">☰</div>
          </div>
          <div className="shopping-cart">🛒</div>
        </div>
        <div className="username">Username</div>
        <div className="nav-buttons">
          <Link to="/normalorder" className="nav-btn">Normal</Link>
          <Link to="/quickorder" className="nav-btn">Quick</Link>
        </div>
      </div>

      {/* Cart Items */}
      <div className="cart-section">
        <h2>Items in Your Cart</h2>
        {/* Render pizzas */}
        {cartItems.pizzas.map((item, index) => (
          <div key={index} className="cart-item">
            <img src="https://via.placeholder.com/100" alt={item.pizza.name} className="item-image" />
            <div className="item-info">
              <h3>{item.pizza.name}</h3>
              <p>{(item.pizza.price * item.quantity).toFixed(2)} €</p>
              <div className="quantity-control">
                <button onClick={() => decreaseQuantity(index, 'pizzas')}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(index, 'pizzas')}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drinks Section */}
      <div className="drinks-section">
        <h2>Would you like drinks?</h2>
        {cartItems.drinks.map((item, index) => (
          <div key={index} className="cart-item">
            <img src="https://via.placeholder.com/100" alt={item.drink.name} className="item-image" />
            <div className="item-info">
              <h3>{item.drink.name}</h3>
              <p>{item.drink.price} €</p>
              <button>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desserts Section */}
      <div className="desserts-section">
        <h2>Would you like desserts?</h2>
        {cartItems.desserts.map((item, index) => (
          <div key={index} className="cart-item">
            <img src="https://via.placeholder.com/100" alt={item.dessert.name} className="item-image" />
            <div className="item-info">
              <h3>{item.dessert.name}</h3>
              <p>{item.dessert.price} €</p>
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
