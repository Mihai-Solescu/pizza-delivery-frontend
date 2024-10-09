import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './NormalOrder.css'; // Custom styles for pizza card

// Modal component for displaying pizza details
function PizzaDetailsModal({ pizza, onClose }) {
  const defaultPizzaImage = "https://media.istockphoto.com/id/1671506157/nl/foto/slice-of-pizza-melted-cheese-stretches-from-the-piece.jpg?s=2048x2048&w=is&k=20&c=rEGVINGvZneoC6KtYBtB11ySq6cqD6nAhjMdgtyrkIA=";

  if (!pizza) return null; // Don't show the modal if no pizza is selected

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <h1>{pizza.name}</h1>
        <img src={defaultPizzaImage} alt={pizza.name} className="details-pizza-image" />
        <p><strong>Description:</strong> {pizza.description || 'No description available'}</p>
        <p><strong>Price:</strong> {pizza.price} €</p>
        <p><strong>Vegan:</strong> {pizza.is_vegan ? 'Yes' : 'No'}</p>
        <p><strong>Vegetarian:</strong> {pizza.is_vegetarian ? 'Yes' : 'No'}</p>
        <p><strong>Ingredients:</strong></p>
        <div className="ingredient-list">
            <ul>
              {pizza.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient.name} - {ingredient.price} €</li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  );
}

function NormalOrder() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pizzas, setPizzas] = useState([]);  // State to hold pizza listings
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);  // Error state
  const [selectedPizza, setSelectedPizza] = useState(null);  // Holds the pizza clicked
  const [showModal, setShowModal] = useState(false); // Controls the modal display

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Fetch pizza listings from the server when the component mounts
  useEffect(() => {
    const fetchPizzas = async () => {
      const token = localStorage.getItem('accessToken');  // Get the JWT token from local storage
      try {
        const response = await axios.get('http://localhost:8000/menu/pizzalist/', {
          headers: {
            Authorization: `Bearer ${token}`,  // Include the JWT token in the headers
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

  // Function to handle pizza click and open the modal
  const handlePizzaClick = (pizza) => {
    setSelectedPizza(pizza);  // Set the clicked pizza as selected
    setShowModal(true);  // Show the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);  // Hide the modal
    setSelectedPizza(null);  // Clear selected pizza
  };

  if (loading) {
    return <div>Loading pizzas...</div>;  // Show loading message while fetching data
  }

  if (error) {
    return <div>{error}</div>;  // Display error if something goes wrong
  }

  return (
    <div className="normal-order-page">
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
          {/* Shopping Cart Icon */}
          <div className="shopping-cart">
            <Link to="/cart">🛒</Link>
          </div>
          <div className="username">{localStorage.getItem("userName")}</div>

        </div>
        <div className="nav-buttons">
          <Link to="/normalorder" className="nav-btn-normal1">Normal</Link>
          <Link to="/quickorder" className="nav-btn-quick1">Quick</Link>
        </div>
      </div>

      <div className="wrapper">
        {/* Pizza list */}
        <div className="pizza-list">
          {pizzas.map((pizza, index) => (
            <div key={index} className="pizza-item-card">
              <img src="https://media.istockphoto.com/id/1671506157/nl/foto/slice-of-pizza-melted-cheese-stretches-from-the-piece.jpg?s=2048x2048&w=is&k=20&c=rEGVINGvZneoC6KtYBtB11ySq6cqD6nAhjMdgtyrkIA=" alt={pizza.name} className="pizza-card-image" />
              <div className="pizza-card-info">
                <h3>{pizza.name}</h3>
                <p>{pizza.price} €</p>
                <button className="more-info-btn" onClick={() => handlePizzaClick(pizza)}>
                  More Info
                </button>
                <button className="add-to-cart-btn">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show the modal if a pizza is selected */}
      {showModal && <PizzaDetailsModal pizza={selectedPizza} onClose={handleCloseModal} />}
    </div>
  );
}

export default NormalOrder;