import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css';  // Assuming you'll create this CSS file for styling
import { Link } from 'react-router-dom';

function CartItemCard({ item, type, increaseQuantity, decreaseQuantity, index }) {
  const itemId = item[type]?.id;
  return (
    <div className="cart-item">
      <img src="https://via.placeholder.com/100" alt={item[type].name} className="item-image" />
      <div className="item-info">
        <h3>{item[type].name}</h3>
        <p>{(item[type].price * item.quantity).toFixed(2)} €</p>
        <div className="quantity-control">
          <button onClick={() => increaseQuantity(index, type, itemId)}>+</button>
          <span>{item.quantity}</span>
          <button onClick={() => decreaseQuantity(index, type, itemId)}>-</button>
        </div>
      </div>
    </div>
  );
}

function CartPage() {
  const [cartItems, setCartItems] = useState({pizza: [], drink: [], dessert: [] }); // Initialize cartItems as an object with arrays
  const [totalPrice, setTotalPrice] = useState(0); 
  const [totalCartItems, setTotalCartItems] = useState(0); // Initialize totalCartItems state
  const [menuOpen, setMenuOpen] = useState(false);

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
        setCartItems(response.data);
        console.log('Fetched cart items', cartItems);
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

    fetchTotalPrice();
    fetchCartItemCount();
    fetchCartItems();
  }, []);

  // Increase quantity of an item and call server
  const increaseQuantity = async (index, type, itemId) => {
    // Ensure cartItems[type] exists and is an array
    if (!Array.isArray(cartItems[type])) {
      console.error(`cartItems[${type}] is not an array or does not exist`);
      return;
    }
    // Ensure item exists at the given index
    const currentItem = cartItems[type][index];
    if (!currentItem) {
      console.error(`No item found at index ${index} for type ${type}`);
      return;
    }
    
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
      cartItems[type][index].quantity += 1;
      setTotalCartItems(totalCartItems + 1);
      fetchTotalPrice();
    } catch (error) {
      console.error('Error updating quantity on the server:', error);
    }
  };

  // Decrease quantity of an item and call server
  const decreaseQuantity = async (index, type, itemId) => {
    if (cartItems[type][index].quantity > 0) {
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
        cartItems[type][index].quantity -= 1;
        setTotalCartItems(totalCartItems - 1);
        fetchTotalPrice();
      } catch (error) {
        console.error('Error updating quantity on the server:', error);
      }
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
              <Link to="/cart">
                🛒 <span className="cart-item-count"></span> {/* Show the cart item count */}
              </Link>
            </div>
            <div className="username">{localStorage.getItem("userName")}</div>
          </div>
          <div className="nav-buttons">
            <Link to="/normalorder" className="nav-btn-normal1">Normal</Link>
            <Link to="/quickorder" className="nav-btn-quick1">Quick</Link>
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
          {cartItems.pizza.map((item, index) => (
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
          {cartItems.drink.map((item, index) => (
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
          {cartItems.dessert.map((item, index) => (
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
