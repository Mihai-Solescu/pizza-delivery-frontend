import { useState, useEffect } from 'react';
import axios from 'axios';
import './Questionary.css'; // Custom CSS for styling

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    favourite_sauce: 0, // default to Tomato
    cheese_preference: 0, // default to Mozzarella
    // Initialize toppings with a neutral preference (could be 0 for Neutral, 1 for Like, 2 for Dislike)
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
    // Add the required variables for the filters
    spicy: 0.000, // default to 0.000
    is_meat: 0.000, // default to 0.000
    is_vegetable: 0.000, // default to 0.000
    cheesy: 0.000, // default to 0.000
    sweet: 0.000, // default to 0.000
    salty: 0.000, // default to 0.000
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
            favourite_sauce: responseData.favourite_sauce || 0,
            cheese_preference: responseData.cheese_preference || 0,
            toppings: {}, // Initialize empty toppings
            spiciness_level: responseData.spiciness_level || 0,
            is_vegetarian: responseData.is_vegetarian || false,
            is_vegan: responseData.is_vegan || false,
            pizza_size: responseData.pizza_size || 1,
            budget_range: responseData.budget_range || 7,
          };

          // Populate the toppings based on the response data
          responseData.toppings.forEach(topping => {
            updatedPreferences.toppings[topping.name] = topping.preference;
          });

          // Set the updated preferences in state
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
    console.log(preferences)
    e.preventDefault(); // Prevent the default form submission

    const accessToken = localStorage.getItem('accessToken'); // Retrieve the access token

    try {
      // Send preferences to the server with the authorization header
      await axios.post('http://localhost:8000/customers/preferences/', preferences, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token in the request headers
        },
      });
      alert('Preferences saved!'); // Alert on successful save
      window.location.href = '/normalorder';
    } catch (error) {
      console.error('Error submitting preferences:', error); // Log any error
    }
  };

  return (
    <div className="questionnaire-container">
      <h1>Please fill in your preferences</h1>
      <form onSubmit={handleQuestionnaireSubmit}>

        {/* Toppings Selection */}
        <div className="form-group">
          <label>Preferred Toppings:</label>
          {Object.keys(preferences.toppings).map((topping) => (
            <div key={topping}>
              <label>{topping.replace('_', ' ').charAt(0).toUpperCase() + topping.replace('_', ' ').slice(1)}:</label>
              <div>
                <input
                  type="radio"
                  name={`topping_${topping}`}
                  value="-1" // Dislike
                  checked={preferences.toppings[topping] === -1}
                  onChange={() => setPreferences({
                    ...preferences,
                    toppings: { ...preferences.toppings, [topping]: -1 }
                  })}
                /> Dislike
                <input
                  type="radio"
                  name={`topping_${topping}`}
                  value="0" // Neutral
                  checked={preferences.toppings[topping] === 0}
                  onChange={() => setPreferences({
                    ...preferences,
                    toppings: { ...preferences.toppings, [topping]: 0 }
                  })}
                /> Neutral
                <input
                  type="radio"
                  name={`topping_${topping}`}
                  value="1" // Like
                  checked={preferences.toppings[topping] === 1}
                  onChange={() => setPreferences({
                    ...preferences,
                    toppings: { ...preferences.toppings, [topping]: 1 }
                  })}
                /> Like
              </div>
            </div>
          ))}
        </div>

        {/* Spiciness Level */}
        <div className="form-group">
          <label>
            Spiciness Level:
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={preferences.spicy}
              onChange={(e) => setPreferences({ ...preferences, spicy: parseFloat(e.target.value) })}
            />
            <span>{preferences.spicy}</span>
          </label>
        </div>

        {/* Sweet Level */}
        <div className="form-group">
          <label>
            Sweet Level:
            <input
              type="range"
              min="0"
              max="10"
              step="0.01"
              value={preferences.sweet}
              onChange={(e) => setPreferences({ ...preferences, sweet: parseFloat(e.target.value) })}
            />
            <span>{preferences.sweet}</span>
          </label>
        </div>

        {/* Salty Level */}
        <div className="form-group">
          <label>
            Salt Level:
            <input
              type="range"
              min="0"
              max="10"
              step="0.001"
              value={preferences.salty}
              onChange={(e) => setPreferences({ ...preferences, salty: parseFloat(e.target.value) })}
            />
            <span>{preferences.salty}</span>
          </label>
        </div>

        {/* Meat Level */}
        <div className="form-group">
          <label>
            Meaty:
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={preferences.is_meat}
              onChange={(e) => setPreferences({ ...preferences, is_meat: parseFloat(e.target.value) })}
            />
            <span>{preferences.is_meat}</span>
          </label>
        </div>

        {/* Vegetable Level */}
        <div className="form-group">
          <label>
            Vegetable:
            <input
              type="range"
              min="0"
              max="10"
              step="0.01"
              value={preferences.is_vegetable}
              onChange={(e) => setPreferences({ ...preferences, is_vegetable: parseFloat(e.target.value) })}
            />
            <span>{preferences.is_vegetable}</span>
          </label>
        </div>

        {/* Cheesy Level */}
        <div className="form-group">
          <label>
            Cheesy:
            <input
              type="range"
              min="0"
              max="10"
              step="0.01"
              value={preferences.cheesy}
              onChange={(e) => setPreferences({ ...preferences, cheesy: parseFloat(e.target.value) })}
            />
            <span>{preferences.cheesy}</span>
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

export default Preferences;