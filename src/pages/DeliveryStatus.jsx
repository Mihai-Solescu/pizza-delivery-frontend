import React, { useState } from 'react';
import axios from 'axios';
import './DeliveryStatus.css'; // Import the CSS file

const DeliveryStatusPage = () => {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setOrderId(e.target.value);
  };

  const fetchOrderStatus = async () => {
    if (!orderId) {
      setError('Please enter an Order ID.');
      setOrderStatus(null);
      return;
    }

    if (!/^\d+$/.test(orderId)) {
      setError('Order ID must be a number.');
      setOrderStatus(null);
      return;
    }

    setLoading(true);
    setError(null);
    setOrderStatus(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:8000/orders/${orderId}/status/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrderStatus(response.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError('Order does not exist.');
        } else if (err.response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError(`Error: ${err.response.data.error || 'An error occurred while fetching the order status.'}`);
        }
      } else if (err.request) {
        setError('No response received from the server.');
      } else {
        setError(`Request error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOrderStatus();
  };

  return (
    <div className="container">
      <h1>Check Your Order Status</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={handleInputChange}
          className="input"
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Loading...' : 'Check Status'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {orderStatus && (
        <div className="statusContainer">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> {orderStatus.id}</p>
          <p><strong>Status:</strong> {orderStatus.status}</p>
          <p><strong>Estimated Delivery Time:</strong> {orderStatus.estimated_delivery_time ? new Date(orderStatus.estimated_delivery_time).toLocaleString() : 'N/A'}</p>
          
          {orderStatus.delivery && (
            <>
              <h3>Delivery Information</h3>
              <p><strong>Order ID:</strong> {orderStatus.id}</p>
              <p><strong>Delivery Status:</strong> {orderStatus.delivery.delivery_status}</p>
              <p><strong>Pizza Quantity:</strong> {orderStatus.delivery.pizza_quantity}</p>
              <p><strong>Delivery Address:</strong> {orderStatus.delivery.delivery_address}</p>
              <p><strong>Postal Code:</strong> {orderStatus.delivery.postal_code}</p>
              <p><strong>Delivery Person:</strong> {orderStatus.delivery.delivery_person ? orderStatus.delivery.delivery_person.name : 'Not Assigned'}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryStatusPage;