import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Add this import
import './DeliveryStatus.css';


const DeliveryStatusPage = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assigningDelivery, setAssigningDelivery] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Menu state
  const [cartItemCount, setCartItemCount] = useState(0); // Cart item count state

  // Fetch the latest order status on component mount
  useEffect(() => {
    fetchLatestOrderStatus();
    fetchCartItemCount(); // Fetch cart item count
  }, []);

  const fetchLatestOrderStatus = async () => {
    setLoading(true);
    setError(null);
    setOrderStatus(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8000/orders/latest/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrderStatus(response.data);
      console.log('Order Status:', response.data); // For debugging
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItemCount = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.get('http://localhost:8000/orders/itemcount/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItemCount(response.data.item_count || 0);  // Set the cart item count
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const assignDelivery = async (orderId) => {
    setAssigningDelivery(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:8000/delivery/assign_delivery/',
        { order_id: orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (err) {
      handleError(err);
    } finally {
      setAssigningDelivery(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancellingOrder(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `http://localhost:8000/orders/${orderStatus.id}/cancel/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.status === 'Order canceled') {
        setOrderStatus({ ...orderStatus, status: 'canceled' });
      } else {
        setError('Failed to cancel the order.');
      }
    } catch (err) {
      handleError(err);
    } finally {
      setCancellingOrder(false);
    }
  };

  const handleError = (err) => {
    if (err.response) {
      if (err.response.status === 404) {
        setError('No recent orders found.');
      } else if (err.response.status === 401) {
        setError('Unauthorized. Please log in again.');
      } else {
        setError(
          err.response.data.error || 'An error occurred while processing your request.'
        );
      }
    } else if (err.request) {
      setError('No response received from the server.');
    } else {
      setError(`Request error: ${err.message}`);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the menu open/close state
  };

  return (
    <div className="delivery-status-container">

      {/* Header section from QuickOrder */}
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
            {/* Shopping Cart Icon with Item Count */}
            <div className="shopping-cart">
              <Link to="/cart">
                🛒 <span className="cart-item-count">{cartItemCount}</span> {/* Show the cart item count */}
              </Link>
            </div>
            <div className="username">{localStorage.getItem("userName")}</div>
          </div>

          <div className="nav-buttons">
            <Link to="/normalorder" className="nav-btn-normal1">Normal</Link>
            <Link to="/quickorder" className="nav-btn-quick1">Quick</Link>
            <Link to="/deliverystatus" className="nav-btn-normal1">Delivery Status</Link>
            <Link to="/earnings" className="nav-btn-normal1">Earnings</Link>
            <Link to="/account" className="nav-btn-normal1">Account</Link>
            <Link to="/preferences" className='nav-btn-normal1'>Preferences</Link>
            <Link to="/restaurantdashboard" className="nav-btn-normal1">Restaurant Dashboard</Link>
          </div>
        </div>
      </header>
      {/* End of Header section */}

      <h1>Check Your Latest Order Status</h1>

      {loading && <p>Loading...</p>}
      {error && <div className="error">{error}</div>}

      {orderStatus && (
        <div className="statusContainer">
          <h2>Order Details</h2>
          <p>
            <strong>Order ID:</strong> {orderStatus.id}
          </p>
          <p>
            <strong>Status:</strong> {orderStatus.status}
          </p>
          <p>
            <strong>Estimated Delivery Time:</strong>{' '}
            {orderStatus.estimated_delivery_time
              ? new Date(orderStatus.estimated_delivery_time).toLocaleString()
              : 'N/A'}
          </p>

          {/* Adjusted Conditional Rendering */}
          {orderStatus.delivery && orderStatus.delivery.delivery_id ? (
            <>
              <h3>Delivery Information</h3>
              <p>
                <strong>Delivery Status:</strong>{' '}
                {orderStatus.delivery.delivery_status}
              </p>
              <p>
                <strong>Pizza Quantity:</strong>{' '}
                {orderStatus.delivery.pizza_quantity}
              </p>
              <p>
                <strong>Delivery Address:</strong>{' '}
                {orderStatus.delivery.delivery_address}
              </p>
              <p>
                <strong>Postal Code:</strong>{' '}
                {orderStatus.delivery.delivery_postal_code}
              </p>
              <p>
                <strong>Delivery Person:</strong>{' '}
                {orderStatus.delivery.delivery_person
                  ? orderStatus.delivery.delivery_person.name
                  : 'Not Assigned'}
              </p>
            </>
          ) : (
            <div>
              <p>No delivery assigned yet.</p>
              <button
                onClick={() => assignDelivery(orderStatus.id)}
                className="assignButton"
                disabled={assigningDelivery}
              >
                {assigningDelivery ? 'Assigning...' : 'Assign Delivery'}
              </button>
            </div>
          )}

          {/* Cancel Order Button */}
          {orderStatus.status !== 'canceled' && (
            <button
              onClick={handleCancelOrder}
              className="cancelButton"
              disabled={cancellingOrder}
            >
              {cancellingOrder ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryStatusPage;
