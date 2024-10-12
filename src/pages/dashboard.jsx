import React, { useState } from 'react';
import OrderStatus from './OrderStatus.jsx';
import OrderCancellation from './OrderCancellation';

const OrderDashboard = () => {
  const [orderId, setOrderId] = useState(null);
  const [orderCanceled, setOrderCanceled] = useState(false);

  const exampleOrderId = 1;

  React.useEffect(() => {
    setOrderId(exampleOrderId);
  }, []);

  const handleCancelSuccess = () => {
    setOrderCanceled(true);
  };

  return (
    <div>
      <h1>Your Order Dashboard</h1>
      {orderCanceled ? (
        <p>Your order has been canceled.</p>
      ) : (
        <>
          {orderId && <OrderStatus orderId={orderId} />}
          {orderId && <OrderCancellation orderId={orderId} onCancelSuccess={handleCancelSuccess} />}
        </>
      )}
    </div>
  );
};

export default OrderDashboard;