import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css';  // Assuming you'll create this CSS file for styling
import { Link } from 'react-router-dom';

function CartItemCard({ item, type, increaseQuantity, decreaseQuantity, index }) {
  return (
    <div className="cart-item">
      <img src="https://via.placeholder.com/100" alt={item[type].name} className="item-image" />
      <div className="item-info">
        <h3>{item[type].name}</h3>
        <p>{(item[type].price * item.quantity).toFixed(2)} €</p>
        <div className="quantity-control">
          <button onClick={() => decreaseQuantity(index, type)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => increaseQuantity(index, type)}>+</button>
        </div>
      </div>
    </div>
  );
}

function CartPage() {
  const [cartItems, setCartItems] = useState({ pizzas: [], drinks: [], desserts: [] }); // Initialize cartItems as an object with arrays
  const [totalPrice, setTotalPrice] = useState(0); 
  const [totalCartItems, setTotalCartItems] = useState(0); // Initialize totalCartItems state

  // Fetch cart items and calculate
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
      } catch (error) {
        console.log('Failed to fetch cart items', error);
      }
    }

    const fetchCartItemCount = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://localhost:8000/orders/itemcount/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalCartItems(response.data.item_count || 0);  // Set the cart item count
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    const fetchTotalPrice = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://localhost:8000/orders/totalprice/', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setTotalPrice(response.data.total_price || 0);  // Set the total price
      } catch (error) {
        console.error('Error fetching total price:', error);
      }
    };

    fetchTotalPrice();
    fetchCartItemCount();
    fetchCartItems();
  }, []);

  // Calculate total price and total cart items based on cart items
  const calculateTotal = (items) => {
    const total = [...items.pizzas, ...items.drinks, ...items.desserts].reduce(
      (acc, item) => acc + item[item.content_type].price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  // Increase quantity of an item and call server
  const increaseQuantity = async (index, type, itemId) => {
    const updatedCart = { ...cartItems };
    updatedCart[type][index].quantity += 1;
    setCartItems(updatedCart);
    calculateTotal(updatedCart);

    // Call server to update the quantity
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post('http://localhost:8000/orders/add-item/', {
        item_type: type,
        item_id: itemId,
        quantity: 1,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error updating quantity on the server:', error);
    }
    setTotalCartItems(totalCartItems + 1); // Increase total cart items
  };

  // Decrease quantity of an item and call server
  const decreaseQuantity = async (index, type, itemId) => {
    const updatedCart = { ...cartItems };
    if (updatedCart[type][index].quantity > 1) {
      updatedCart[type][index].quantity -= 1;
      setCartItems(updatedCart);
      calculateTotal(updatedCart);

      // Call server to update the quantity
      const token = localStorage.getItem('accessToken');
      try {
        await axios.post('http://localhost:8000/orders/remove-item/', {
          item_type: type,
          item_id: itemId,
          quantity: 1,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error updating quantity on the server:', error);
      }
      setTotalCartItems(totalCartItems - 1); // Decrease total cart items
    }
  };

  // Confirm Order
  const handleConfirmOrder = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post('http://localhost:8000/orders/finalize/', {
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
          <div className="shopping-cart">
            🛒 <span className="cart-item-count">{totalCartItems}</span> {/* Display number of items in cart */}
          </div>
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
        
        {/* <CartItemCard 
        item={{ pizza: { name: 'Dummy Pizza', price: 0 }, quantity: 1 }}
        type="pizza"
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        index={-1}
        /> */}

        {/* Render pizzas */}
        {cartItems.pizzas.map((item, index) => (
          <CartItemCard
            key={index}
            item={item}
            type="pizza"
            index={index}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
          />
        ))}

        {/* Render drinks */}
        {cartItems.drinks.map((item, index) => (
          <CartItemCard
            key={index}
            item={item}
            type="drink"
            index={index}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
          />
        ))}

        {/* Render desserts */}
        {cartItems.desserts.map((item, index) => (
          <CartItemCard
            key={index}
            item={item}
            type="dessert"
            index={index}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
          />
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
