import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderStatus = ({ orderId }) => {
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderStatus();

    const interval = setInterval(fetchOrderStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrderStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:8000/orders/${orderId}/status/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch order status.');
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!orderData) {
    return <p>Loading order status...</p>;
  }

  const {
    status,
    estimated_delivery_time,
    delivery_status,
    is_grouped_delivery,
    grouped_pizzas_count,
    delivery_person_name,
  } = orderData;

  return (
    <div>
      <h2>Order Status</h2>
      <p><strong>Status:</strong> {status}</p>
      {delivery_status && <p><strong>Delivery Status:</strong> {delivery_status}</p>}
      {estimated_delivery_time && (
        <p><strong>Estimated Delivery Time:</strong> {estimated_delivery_time} minutes</p>
      )}
      {is_grouped_delivery && (
        <>
          <p><strong>Your order is part of a grouped delivery.</strong></p>
          <p><strong>Total Pizzas in Delivery:</strong> {grouped_pizzas_count}</p>
        </>
      )}
      {delivery_person_name && <p><strong>Delivery Person:</strong> {delivery_person_name}</p>}
    </div>
  );
};

export default OrderStatus;