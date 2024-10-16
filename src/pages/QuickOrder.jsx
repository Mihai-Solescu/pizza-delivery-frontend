import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './QuickOrder.css'; // Custom styles for pizza card
import axios from "axios"; // Import axios for API requests

// Modal component for displaying pizza details
function Questionnaire_Advise_popup({ onClose, onQuickOrder }) {
  return (
    <div className="advise-overlay" onClick={onClose}>
      <div className="advise-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Do you want to pass a small questionnaire?</h2>
        <h3>Preferences will be used by default</h3>
        <div className="option-buttons">
          <button className="refuse-btn" onClick={onQuickOrder}> Skip (use default) </button>
          <Link to="/quickQuestionnaire" className="accept-btn"> Pass </Link>
        </div>
      </div>
    </div>
  );
}

function QuickOrder() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Controls the modal display
  const [isLoading, setIsLoading] = useState(false); // Optional: Add a loading state
  const [cartItemCount, setCartItemCount] = useState(0); // Cart item count state
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
    spiciness_level: 0, // default to Mild
    is_vegetarian: false,
    is_vegan: false,
    pizza_size: 1, // default to Medium
    budget_range: 7.00, // default to 7
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

  // Function to handle pizza click and open the modal
  const handleBRBClick = () => {
    console.log("Big Red Button clicked!");
    setShowPopup(true);  // Show the modal
  };

  // Function to close the modal
  const handleClosePopup = () => {
    console.log("Close Button clicked!");
    setShowPopup(false);  // Hide the modal
  };

  // Function to handle the quick order request
  const handleQuickOrder = async () => {
    setIsLoading(true); // Optional: Set loading state
    const token = localStorage.getItem('accessToken'); // Get user's auth token if needed

    let pizzaId = null; // Variable to store the pizza ID

    try {
      const response = await axios.get('http://localhost:8000/customers/preferences/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    }

    try {
      const queryParams = new URLSearchParams({
        smart: 'false',
        order_type: 'quick',
        budget_range: preferences.budget_range,
        is_vegetarian: preferences.is_vegetarian,
        is_vegan: preferences.is_vegan,
      }).toString();

      const response = await axios.get(`http://localhost:8000/menu/pizzalist/?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.length > 0) {
        const selectedPizza = response.data[0]; // Store the first pizza in a variable
        pizzaId = selectedPizza.id; // Store the pizza's ID
        alert('pizza-' + selectedPizza.name); // Notify user
      }

      setShowPopup(false); // Close the modal
    } catch (error) {
      console.error('Error during quick order request:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Optional: Clear loading state
    }

    if (pizzaId) {
      try {
        await axios.post(
          'http://localhost:8000/orders/add-item/',
          {
            item_type: 'pizza',
            item_id: pizzaId, // Use the stored pizza ID here
            quantity: 1,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        window.location.href = '/cart';
      } catch (error) {
        console.error('Failed to add item to cart:', error);
      }
    } else {
      console.error('No pizza selected to add to the cart.');
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

      {/* Big Circular Button */}
      <div className="big-red-button-container">
        <button className="big-red-button" onClick={handleBRBClick}>
          Order via Questionnaire
        </button>
      </div>

      {/* Explanation Text Below the Button */}
      <div className="quick-order-explanation">
        <p>
          This button prompts you to answer a questionnaire. Then, a rule-based system combines your answers with 
          your preferences to quickly generate an order with one pizza.
        </p>
      </div>

      {/* Show the modal if a pizza is selected */}
      {showPopup && (
        <Questionnaire_Advise_popup
          onClose={handleClosePopup}
          onQuickOrder={handleQuickOrder} // Pass quick order handler
        />
      )}

      {/* Optional: Show a loading state */}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default QuickOrder;
