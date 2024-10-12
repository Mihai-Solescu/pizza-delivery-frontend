import { useState, useEffect } from 'react';
import axios from 'axios';
import './Questionary.css'; // Custom CSS for styling

const QuickQuestionary = () => {
  const [preferences, setPreferences] = useState({
    spiciness_level: 0, // default to Mild
    is_vegetarian: false,
    is_vegan: false,
    pizza_size: 1, // default to Medium
    budget_range: 7.00, // default to 7
  });

  // Fetch user preferences when the component mounts
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('http://localhost:8000/customers/preferences/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include access token if required
          },
        });

        // Transform the response data to fit the preferences model
        if (response.data) {
          const responseData = response.data;

          // Create a new preferences object based on the API response
          const updatedPreferences = {
            spiciness_level: responseData.spiciness_level || 0,
            is_vegetarian: responseData.is_vegetarian || false,
            is_vegan: responseData.is_vegan || false,
            pizza_size: responseData.pizza_size || 1,
            budget_range: responseData.budget_range || 7,
          };

          // Set the updated preferences in state
          console.log(updatedPreferences);
          setPreferences(updatedPreferences);
          console.log(preferences);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, []); // Run only on mount

  const handleQuestionnaireSubmit = async (e) => {
    e.preventDefault(); // Prevent form from submitting normally
    const token = localStorage.getItem('accessToken'); // Get user's auth token

    let selectedPizzaId = null; // Variable to store the selected pizza ID

    try {
        // Construct query parameters based on preferences
        const queryParams = new URLSearchParams({
            smart: 'false',
            order_type: 'quick',
            budget_range: preferences.budget_range,
            is_vegetarian: preferences.is_vegetarian,
            is_vegan: preferences.is_vegan,
        }).toString();

        console.log(queryParams);

        const response = await axios.get(`http://localhost:8000/menu/pizzalist/?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response.data);

        if (response.data.length > 0) {
            const selectedPizza = response.data[0]; // Store the first pizza in a variable
            selectedPizzaId = selectedPizza.id; // Store the pizza's ID
            alert('Selected Pizza: ' + selectedPizza.name); // Notify user
        } else {
            alert('No pizzas found with your preferences.');
        }

        // Proceed with another request or action using the selected pizza ID
        if (selectedPizzaId) {
            // You can make another API call, like adding the pizza to the cart:
            try {
                await axios.post(
                    'http://localhost:8000/orders/add-item/',
                    {
                        item_type: 'pizza',
                        item_id: selectedPizzaId, // Use the stored pizza ID here
                        quantity: 1,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log('Pizza added to the cart successfully!');
                window.location.href = '/cart';
            } catch (error) {
                console.error('Failed to add item to cart:', error);
            }
        }

    } catch (error) {
        console.error('Error during quick order request:', error);
        alert('An error occurred. Please try again.');
    }
};

  return (
    <div className="questionnaire-container">
      <h1>Please fill in your preferences</h1>
      <form onSubmit={handleQuestionnaireSubmit}>

        {/* Spiciness Level */}
        <div className="form-group">
          <label>
            Spiciness Level:
            <select
              value={preferences.spiciness_level}
              onChange={(e) => setPreferences({ ...preferences, spiciness_level: parseInt(e.target.value) })}
            >
              <option value={0}>Mild</option>
              <option value={1}>Medium</option>
              <option value={2}>Spicy</option>
            </select>
          </label>
        </div>

        {/* Dietary Restrictions */}
        <div className="form-group">
          <label>
            Is Vegetarian?
            <input
              type="checkbox"
              checked={preferences.is_vegetarian}
              onChange={(e) => setPreferences({ ...preferences, is_vegetarian: e.target.checked })}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Is Vegan?
            <input
              type="checkbox"
              checked={preferences.is_vegan}
              onChange={(e) => setPreferences({ ...preferences, is_vegan: e.target.checked })}
            />
          </label>
        </div>

        {/* Pizza Size */}
        <div className="form-group">
          <label>
            Pizza Size:
            <select
              value={preferences.pizza_size}
              onChange={(e) => setPreferences({ ...preferences, pizza_size: parseInt(e.target.value) })}
            >
              <option value={0}>Small</option>
              <option value={1}>Medium</option>
              <option value={2}>Large</option>
            </select>
          </label>
        </div>

        {/* Budget Range */}
        <div className="form-group">
          <label>
            Budget Range:
            <input
              type="number"
              value={preferences.budget_range}
              onChange={(e) => setPreferences({ ...preferences, budget_range: parseFloat(e.target.value) })}
              step="0.1"
              min="0"
            />
          </label>
        </div>

        <button type="submit" className="btn-questionnaire">Submit Preferences</button>
      </form>
    </div>
  );
};

export default QuickQuestionary;