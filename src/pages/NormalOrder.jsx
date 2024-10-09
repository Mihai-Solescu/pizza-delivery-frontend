import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './NormalOrder.css';
import vegan_tag from '../assets/vegan_tag.png';
import vegetarian_tag from '../assets/vegetarian_tag.png';
import try_tag from '../assets/try_tag.png';
import rate_tag from '../assets/rate_tag.png';
import order_tag from '../assets/order_tag.png';

function PizzaDetailsModal({ pizza, onClose }) {
  const defaultPizzaImage = "https://media.istockphoto.com/id/1671506157/nl/foto/slice-of-pizza-melted-cheese-stretches-from-the-piece.jpg?s=2048x2048&w=is&k=20&c=rEGVINGvZneoC6KtYBtB11ySq6cqD6nAhjMdgtyrkIA=";

  if (!pizza) return null;

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
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const fetchPizzas = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://localhost:8000/menu/pizzalist/', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setPizzas(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pizzas');
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  const handlePizzaClick = (pizza) => {
    setSelectedPizza(pizza);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPizza(null);
  };

  const handleTagClick = (pizzaId, tagName) => {
    // Find the pizza in the current state
  const updatedPizzas = pizzas.map(pizza => {
    if (pizza.pizza_id === pizzaId) {
      // Toggle the specific tag
      const updatedTags = { ...pizza.tags, [tagName]: !pizza.tags[tagName] };

      // Send the POST request to update the tag on the backend
      const token = localStorage.getItem('accessToken');
      axios.post(`http://localhost:8000/menu/pizza/${pizzaId}/tags/`, {
        rate_tag: updatedTags.rate_tag,
        order_tag: updatedTags.order_tag,
        try_tag: updatedTags.try_tag,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then(response => {
        console.log(`Tag updated: ${response.data}`);
      }).catch(err => {
        console.error(`Error updating tag: ${err}`);
      });

      // Return the updated pizza with the new tag state
      return { ...pizza, tags: updatedTags };
    }
    return pizza;
  });

  // Update the pizzas state with the updated tags
  setPizzas(updatedPizzas);
};

  if (loading) {
    return <div>Loading pizzas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
        <div className="pizza-list">
          {pizzas.map((pizza, index) => (
            <div key={index} className="pizza-item-card">
              <img src="https://media.istockphoto.com/id/1671506157/nl/foto/slice-of-pizza-melted-cheese-stretches-from-the-piece.jpg?s=2048x2048&w=is&k=20&c=rEGVINGvZneoC6KtYBtB11ySq6cqD6nAhjMdgtyrkIA=" alt={pizza.name} className="pizza-card-image" />
              <div className="pizza-card-info">
                <div className="pizza-item-heading">
                  <div className="pizza-label">
                    <h3>{pizza.name}</h3>
                    <p>{pizza.price} €</p>
                  </div>
                  <div className="pizza-tags">
                    <img
                      src={order_tag}
                      alt="order tag"
                      style={{ opacity: pizza.tags.order_tag ? 1 : 0.1 }}
                      onClick={() => handleTagClick(pizza.pizza_id, 'order_tag')}
                    />
                    <img
                      src={rate_tag}
                      alt="rate tag"
                      style={{ opacity: pizza.tags.rate_tag ? 1 : 0.1 }}
                      onClick={() => handleTagClick(pizza.pizza_id, 'rate_tag')}
                    />
                    <img
                      src={try_tag}
                      alt="try tag"
                      style={{ opacity: pizza.tags.try_tag ? 1 : 0.1 }}
                      onClick={() => handleTagClick(pizza.pizza_id, 'try_tag')}
                    />
                    <img
                      src={vegan_tag}
                      alt="vegan tag"
                      style={{ opacity: pizza.tags.vegan_tag ? 1 : 0.3 }}
                    />
                    <img
                      src={vegetarian_tag}
                      alt="vegetarian tag"
                      style={{ opacity: pizza.tags.vegetarian_tag ? 1 : 0.3 }}
                    />
                  </div>
                </div>
                <div className="pizza-card-buttons">
                  <button className="more-info-btn" onClick={() => handlePizzaClick(pizza)}>
                    More Info
                  </button>
                  <button className="add-to-cart-btn">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <PizzaDetailsModal pizza={selectedPizza} onClose={handleCloseModal} />}
    </div>
  );
}

export default NormalOrder;