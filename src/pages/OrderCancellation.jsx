import React, { useState } from 'react';
import axios from 'axios';

const OrderCancellation = ({ orderId, onCancelSuccess }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `http://localhost:8000/orders/${orderId}/cancel/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsCancelling(false);
      if (response.data.status === 'Order canceled') {
        onCancelSuccess();
      } else {
        setCancelError('Failed to cancel the order.');
      }
    } catch (err) {
      setIsCancelling(false);
      setCancelError(err.response?.data?.error || 'Failed to cancel the order.');
    }
  };

  return (
    <div>
      <h2>Cancel Order</h2>
      {cancelError && <p style={{ color: 'red' }}>{cancelError}</p>}
      <button onClick={handleCancelOrder} disabled={isCancelling}>
        {isCancelling ? 'Cancelling...' : 'Cancel Order'}
      </button>
    </div>
  );
};

export default OrderCancellation;