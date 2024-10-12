import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './NormalOrder.css';
import vegan_tag from '../assets/vegan_tag.png';
import vegetarian_tag from '../assets/vegetarian_tag.png';
import try_tag from '../assets/try_tag.png';
import rate_tag from '../assets/rate_tag.png';
import order_tag from '../assets/order_tag.png';

function PizzaDetailsModal({ pizza, onClose, setSelectedPizza, handleUpdatePizza }) {
  const defaultPizzaImage = "https://media.istockphoto.com/id/1671506157/nl/foto/slice-of-pizza-melted-cheese-stretches-from-the-piece.jpg?s=2048x2048&w=is&k=20&c=rEGVINGvZneoC6KtYBtB11ySq6cqD6nAhjMdgtyrkIA=";

  const [userRating, setUserRating] = useState();

  useEffect(() => {
    if (pizza && userRating === undefined) {
      setUserRating(pizza.rating || 0);
    }
  }, [pizza, userRating]);

  const handleRating = async (rating) => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        `http://localhost:8000/menu/pizza/${pizza.pizza_id}/rating`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedPizza = { ...pizza, rating: rating };
        setUserRating(rating);
        setSelectedPizza(updatedPizza);

        // Update the pizza list in the main component
        handleUpdatePizza(updatedPizza);
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  if (!pizza) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1>{pizza.name}</h1>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <img src={defaultPizzaImage} alt={pizza.name} className="details-pizza-image" />
        <p><strong>Description:</strong> {pizza.description || 'No description available'}</p>
        <p><strong>Price:</strong> {pizza.price} €</p>
        <p><strong>Vegan:</strong> {pizza.is_vegan ? 'No' : 'Yes'}</p>
        <p><strong>Vegetarian:</strong> {pizza.is_vegetarian ? 'Yes' : 'No'}</p>
        <p><strong>Ingredients:</strong></p>
        <div className="ingredient-list">
          <ul>
            {pizza.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient.name} - {ingredient.price} €</li>
            ))}
          </ul>
        </div>

        <div className="rating-section">
          <strong>Rating:</strong>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= userRating ? 'star filled' : 'star'}
                onClick={() => handleRating(star)}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function NormalOrder() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState({
    favourite_sauce: 0, // default to Tomato
    cheese_preference: 0, // default to Mozzarella
    toppings: {
      pepperoni: 0,
      mushrooms: 0,
      onions: 0,
      olives: 0,
      sun_dried_tomatoes: 0,
      bell_peppers: 0,
      chicken: 0,
      bacon: 0,
      ham: 0,
      sausage: 0,
      ground_beef: 0,
      anchovies: 0,
      pineapple: 0,
      basil: 0,
      broccoli: 0,
      zucchini: 0,
      garlic: 0,
      jalapenos: 0,
      BBQ_sauce: 0,
      red_peppers: 0,
      spinach: 0,
      feta_cheese: 0,
    },
    spiciness_level: 0,
    is_vegetarian: false,
    is_vegan: false,
    pizza_size: 1,
    budget_range: 7.00,
  });

  const [preferencesLoading, setPreferencesLoading] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Fetch preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://localhost:8000/customers/preferences/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Transform the response data to fit the preferences model
        if (response.data) {
          const responseData = response.data;

          const updatedPreferences = {
            favourite_sauce: responseData.favourite_sauce || 0,
            cheese_preference: responseData.cheese_preference || 0,
            toppings: {},
            spiciness_level: responseData.spiciness_level || 0,
            is_vegetarian: responseData.is_vegetarian || false,
            is_vegan: responseData.is_vegan || false,
            pizza_size: responseData.pizza_size || 1,
            budget_range: responseData.budget_range || 7,
          };

          responseData.toppings.forEach(topping => {
            updatedPreferences.toppings[topping.name] = topping.preference;
          });

          setPreferences(updatedPreferences);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setPreferencesLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Fetch pizzas based on preferences
  useEffect(() => {
    const fetchPizzas = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        // Construct query parameters based on preferences
        const queryParams = new URLSearchParams({
          smart: 'true',
          order_type: 'normal',
          budget_range: preferences.budget_range,
          is_vegetarian: preferences.is_vegetarian,
          is_vegan: preferences.is_vegan,
        });

        // Add toppings preferences as separate query parameters
        Object.entries(preferences.toppings).forEach(([topping, preference]) => {
          queryParams.append(`${topping}`, preference);
        });

        const response = await axios.get(`http://localhost:8000/menu/pizzalist/?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPizzas(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pizzas');
        setLoading(false);
      }
    };

    if (!preferencesLoading) {
      fetchPizzas();
    }
  }, [preferences, preferencesLoading]);

  const handlePizzaClick = (pizza) => {
    setSelectedPizza(pizza);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPizza(null);
  };

  // Function to update pizza in the pizzas list
  const handleUpdatePizza = (updatedPizza) => {
    const updatedPizzas = pizzas.map(pizza =>
      pizza.pizza_id === updatedPizza.pizza_id ? updatedPizza : pizza
    );
    setPizzas(updatedPizzas);
  };

  const handleTagClick = (pizzaId, tagName) => {
    const updatedPizzas = pizzas.map(pizza => {
      if (pizza.pizza_id === pizzaId) {
        const updatedTags = { ...pizza.tags, [tagName]: !pizza.tags[tagName] };

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

        return { ...pizza, tags: updatedTags };
      }
      return pizza;
    });

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
                      style={{ opacity: pizza.tags.order_tag ? 1 : 0.3 }}
                      onClick={() => handleTagClick(pizza.pizza_id, 'order_tag')}
                    />
                    <img
                      src={rate_tag}
                      alt="rate tag"
                      style={{ opacity: pizza.tags.rate_tag ? 1 : 0.3 }}
                      onClick={() => handleTagClick(pizza.pizza_id, 'rate_tag')}
                    />
                    <img
                      src={try_tag}
                      alt="try tag"
                      style={{ opacity: pizza.tags.try_tag ? 1 : 0.3 }}
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

      {showModal && <PizzaDetailsModal pizza={selectedPizza} onClose={handleCloseModal} setSelectedPizza={setSelectedPizza} handleUpdatePizza={handleUpdatePizza} />}
    </div>
  );
}

export default NormalOrder;

