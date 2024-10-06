import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PizzaItem from '../components/PizzaItem'; // Reusing the PizzaItem component
import './NormalOrder.css'; // Custom styles

function NormalOrder() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pizzas, setPizzas] = useState([]);  // State to hold pizza listings
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);  // Error state

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Fetch pizza listings from the server when the component mounts
  useEffect(() => {
    console.log('Fetching pizzas...');

    // Retrieve the tokens from localStorage
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');

    console.log('Access Token:', access);
    console.log('Refresh Token:', refresh);

    const fetchPizzas = async () => {
      const token = localStorage.getItem('accessToken');  // Get the JWT token from local storage
      try {
        const response = await axios.get('http://localhost:8000/menu/pizzalist/', {
          headers: {
            Authorization: `Bearer ${token}`,  // Include the JWT token in the headers if needed
          }
        });
        setPizzas(response.data);  // Set the fetched pizzas to state
        setLoading(false);  // Set loading to false once data is fetched
      } catch (err) {
        setError('Failed to load pizzas');
        setLoading(false);  // Stop loading even if there's an error
      }
    };

    fetchPizzas();
  }, []);  // Empty dependency array to only fetch data on component mount

  if (loading) {
    return <div>Loading pizzas...</div>;  // Show loading message while fetching data
  }

  if (error) {
    return <div>{error}</div>;  // Display error if something goes wrong
  }

  return (
    <div className="normal-order-page">
      {/* Wrapper for the content */}
      <div className="wrapper">
        {/* Header with user info and hamburger menu */}
        <div className="header">
          <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
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
          <div className="username">Username</div>
          <div className="shopping-cart">
            <Link to="/cart">🛒</Link>
          </div>
        </div>

      {/* Pizza list */}
      <div className="pizza-list">
        {pizzas.map((pizza, index) => (
          <PizzaItem
            key={index}
            pizza={{
              name: pizza.name,
              price: pizza.price,
              image: '/path-to-pizza-image.jpg', // Placeholder image for now
              description: `Vegan: ${pizza.is_vegan ? 'Yes' : 'No'} | Vegetarian: ${pizza.is_vegetarian ? 'Yes' : 'No'}`,
              ingredients: pizza.ingredients.map(ingredient => ingredient.name),  // Display ingredient names
              reviews: [],  // Placeholder for reviews
            }}
          />
        ))}
      </div>

        {/* Navigation buttons moved to footer */}
        <div className="bottom-nav">
          <Link to="/normalorder" className="nav-btn">Normal</Link>
          <Link to="/quickorder" className="nav-btn">Quick</Link>
        </div>
      </div>
    </div>
  );
}

export default NormalOrder;