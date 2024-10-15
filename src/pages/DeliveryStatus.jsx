// src/components/DeliveryStatusPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeliveryStatus.css';

const DeliveryStatusPage = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assigningDelivery, setAssigningDelivery] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the latest order status on component mount
  useEffect(() => {
    fetchLatestOrderStatus();
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

  return (
    <div className="delivery-status-container">
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