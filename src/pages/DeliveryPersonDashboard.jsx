import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DeliveryPersonDashboard() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/delivery/my_deliveries/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDeliveries(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDeliveries();
  }, []);

  const updateStatus = async (deliveryId, status) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post(
        `http://localhost:8000/delivery/update_delivery/${deliveryId}/`,
        { delivery_status: status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Update local state
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.delivery_id === deliveryId
            ? { ...delivery, delivery_status: status }
            : delivery
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>My Deliveries</h2>
      {deliveries.map((delivery) => (
        <div key={delivery.delivery_id}>
          <p>Delivery ID: {delivery.delivery_id}</p>
          <p>Status: {delivery.delivery_status}</p>
          <p>Address: {delivery.delivery_address}</p>
          <p>Pizzas: {delivery.pizza_quantity}</p>
          <button onClick={() => updateStatus(delivery.delivery_id, 'in_process')}>
            Start Delivery
          </button>
          <button onClick={() => updateStatus(delivery.delivery_id, 'completed')}>
            Complete Delivery
          </button>
        </div>
      ))}
    </div>
  );
}

export default DeliveryPersonDashboard;