import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './QuickOrder.css'; // Custom styles for pizza card
import MomentaryPreferences from './MomentaryPreferences'; // Import the modal component
import axios from "axios"; // Import axios for API requests
import QuickPizzaDetailsModal from './QuickPizzaDetailsModal'; // Import the pizza details modal

function QuickOrder() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Controls the modal display
  const [isLoading, setIsLoading] = useState(false); // Optional: Add a loading state
  const [cartItemCount, setCartItemCount] = useState(0); // Cart item count state
  const [view, setView] = useState(1); // State to switch between the two bodies
  const [pizzas, setPizzas] = useState([]); // Store pizzas fetched from the server
  const [showPizzas, setShowPizzas] = useState(false); // Control whether pizzas should be shown
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [preferences, setPreferences] = useState({
    spicy: 0,
    sweet: 0,
    cheesy: 0,
    salty: 0,
    is_vegetarian: false,
    is_vegan: false,
    max_budget: 10.00 // Default max budget
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Fetch cart item count
    const fetchCartItemCount = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://localhost:8000/orders/itemcount/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItemCount(response.data.item_count || 0);  // Set the cart item count
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItemCount();
  }, []);

  // Function to handle the quick order request (fetch pizzas from the server)
  const handleQuickOrder = async (preferences) => {
    setIsLoading(true); // Optional: Set loading state
    const token = localStorage.getItem('accessToken'); // Get user's auth token if needed

    // Determine the API URL
    const url = view === 1
      ? 'http://localhost:8000/orders/quickrule/'
      : 'http://localhost:8000/orders/quickrecommend/';

    // If it's the "recommendation" view, append preferences to the query
    let queryParams = '';

    if (view === 1) {
      // Create a query string based on user preferences
      queryParams = new URLSearchParams({
        is_spicy: preferences.spicy === 1,
        is_vegetarian: preferences.is_vegetarian,
        is_vegan: preferences.is_vegan,
        is_cheesy: preferences.cheesy === 1,
        is_sweet: preferences.sweet === 1,
        is_salty: preferences.salty === 1,
        max_budget: preferences.max_budget
      }).toString();
    }

    const fullUrl = `${url}${queryParams ? '?' + queryParams : ''}`;

    try {
      const response = await axios.get(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Server Response:", response.data);
      if (response.data && response.data.length === 3) {
        setPizzas(response.data);
        setShowPopup(false); // Hide the modal
        setShowPizzas(true); // Show the pizza recommendations
      }
      else {
        console.error('Unexpected response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching pizzas:', error);
    } finally {
      setIsLoading(false); // Optional: Clear loading state
    }
  };

  const handleBRBClickDumb = () => {
    console.log("Big Red Button clicked!");
    setShowPopup(true);  // Show the modal
  };

  const handleBRBClickSmart = () => {
    console.log("Big Red Button clicked!");
    handleQuickOrder(preferences);
  };
  
  const handleClosePopup = () => {
    setShowPopup(false); // Hide the modal
  };  

  const handlePizzaClick = (pizza) => {
    setSelectedPizza(pizza); // Set the selected pizza for the modal
  };

  const handleCloseModal = () => {
    setSelectedPizza(null); // Close the modal by setting the selected pizza to null
  };

  // Function to choose a pizza (add to cart)
  const handleChoosePizza = async (pizzaId) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(
        'http://localhost:8000/orders/add-item/',
        {
          item_type: 'pizza',
          item_id: pizzaId,
          quantity: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = '/cart';
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  // Function to switch views
  const toggleView = () => {
    setView(view === 1 ? 2 : 1); // Toggle between view 1 and view 2
  };

  const renderStarRating = (currentRating, onRate) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= currentRating ? 'star filled' : 'star'}
            onClick={() => onRate(star)}
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  };

  const handleRating = async (pizzaId, rating) => {
    const token = localStorage.getItem('accessToken');
  
    try {
      const response = await axios.post(
        `http://localhost:8000/menu/pizza/${pizzaId}/rating`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // If rating is successful, you can update the pizza's rating in the state
      setPizzas((prevPizzas) =>
        prevPizzas.map((pizza) =>
          pizza.id === pizzaId ? { ...pizza, rating } : pizza
        )
      );
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  return (
    <div className="quick-page">
      <header>
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
            {/* Shopping Cart Icon with Item Count */}
            <div className="shopping-cart">
              <Link to="/cart">
                🛒 <span className="cart-item-count">{cartItemCount}</span> {/* Show the cart item count */}
              </Link>
            </div>
            <div className="username">{localStorage.getItem("userName")}</div>
          </div>

          <div className="nav-buttons">
            <Link to="/normalorder" className="nav-btn-normal1">Normal</Link>
            <Link to="/quickorder" className="nav-btn-quick1">Quick</Link>
            <Link to="/deliverystatus" className="nav-btn-normal1">Delivery Status</Link>
            <Link to="/earnings" className="nav-btn-normal1">Earnings</Link>
            <Link to="/account" className="nav-btn-normal1">Account</Link>
            <Link to="/preferences" className='nav-btn-normal1'>Preferences</Link>
            <Link to="/restaurantdashboard" className="nav-btn-normal1">Restaurant Dashboard</Link>
          </div>
        </div>
      </header>

      {/* Conditionally render the button or pizza recommendations */}
      {!showPizzas ? (
        <>
          {/* Body 1 (Rule-Based System) */}
          {view === 1 && (
            <>
              <div className="big-red-button-container">
                <button className="big-red-button" onClick={handleBRBClickDumb}>
                  Order via Questionnaire
                </button>
              </div>

              <div className="quick-order-explanation">
                <p>
                  This button prompts you to answer a questionnaire. Then, a rule-based system combines your answers with 
                  your preferences to quickly generate an order with one pizza.
                </p>
              </div>
            </>
          )}

          {/* Body 2 (Recommender System) */}
          {view === 2 && (
            <>
              <div className="big-red-button-container">
                <button className="big-red-button" onClick={handleBRBClickSmart}>
                  Order via Recommender System
                </button>
              </div>

              <div className="quick-order-explanation">
                <p>
                  This button uses a recommender system to generate a list of order choices based on your preferences.
                </p>
              </div>
            </>
          )}
        </>
      ) : (
        // Display the recommended pizzas after fetching
        <div className="pizza-recommendations">
          {pizzas.map((pizza, index) => (
            <div key={index} className="pizza-item-card">
              <img src={pizza.image} alt={pizza.name} className="pizza-card-image" />
              <div className="pizza-card-info">
                <div className="pizza-item-heading">
                  <div className="pizza-label">
                    <h3>{pizza.name}</h3>
                    <p>{pizza.price} €</p>
                  </div>
                </div>
                {/* Star rating system */}
                <div className="rating-section">
                  {renderStarRating(pizza.rating, (newRating) => handleRating(pizza.id, newRating))}
                </div>
                <div className="pizza-card-buttons">
                  <button className="more-info-btn" onClick={() => handlePizzaClick(pizza)}>
                    More Info
                  </button>
                  <button className="add-to-cart-btn" onClick={() => handleChoosePizza(pizza.id)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      


      {/* Button to Switch Between Views */}
      {!showPizzas && (
        <div className="switch-view-button">
          <button
            onClick={toggleView}
            style={{ backgroundColor: view === 1 ? 'rgba(0, 128, 0, 0.2)' : 'rgba(0, 0, 255, 0.2)' }}
          >
            {/* No Text */}
          </button>
        </div>
      )}

      {/* Show the modal for the Rule-Based System*/}
      {showPopup && view === 1 && (
        <MomentaryPreferences
          onClose={handleClosePopup}
          onQuickOrder={handleQuickOrder} // Pass quick order handler
          preferences={preferences}
          setPreferences={setPreferences}
        />
      )}

      {/* Show the modal for Pizza Details */}
      {selectedPizza && (
        <QuickPizzaDetailsModal
          pizza={selectedPizza}
          onClose={handleCloseModal}
          handleRating={handleRating} // Pass the rating handler
        />
      )}

      {/* Optional: Show a loading state */}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default QuickOrder;
