// src/ConfirmedPizzasList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RestaurantDashboard.css';

const ConfirmedPizzasList = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    // Check if the token exists
    if (!accessToken) {
      console.error('No access token found. Please log in.');
      setLoading(false);
      return;
    }

    // Configure the Axios request with the Authorization header
    axios
      .get('http://localhost:8000/orders/confirmed_pizzas/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setPizzas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching pizzas:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="heading">Pizzas in Confirmed Orders</h1>
      <ul className="pizza-list">
        {pizzas.length > 0 ? (
          pizzas.map((pizza) => (
            <li key={pizza.id} className="pizza-item">
              <h2 className="pizza-name">{pizza.name}</h2>
              <p className="pizza-description">{pizza.description}</p>
            </li>
          ))
        ) : (
          <li>No pizzas found in confirmed orders.</li>
        )}
      </ul>
    </div>
  );
};

export default ConfirmedPizzasList;