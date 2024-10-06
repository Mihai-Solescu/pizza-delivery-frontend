import { useState } from 'react';
import axios from 'axios';
import './Preferences.css'; // Custom CSS for styling

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    favourite_sauce: 0, // default to Tomato
    cheese_preference: 0, // default to Mozzarella
    topping_pepperoni: false,
    topping_mushrooms: false,
    topping_onions: false,
    topping_olives: false,
    topping_bell_peppers: false,
    topping_chicken: false,
    topping_bacon: false,
    topping_ham: false,
    topping_pineapple: false,
    topping_basil: false,
    topping_Jalapenos: false,
    spiciness_level: 0, // default to Mild
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    pizza_size: 1, // default to Medium
    budget_range: 0.00, // default to 0
  });

  const handleQuestionnaireSubmit = async (e) => {
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
    } catch (error) {
      console.error('Error submitting preferences:', error); // Log any error
    }
  };

  return (
    <div className="questionnaire-container">
      <h1>Questionnaire</h1>
      <form onSubmit={handleQuestionnaireSubmit}>
        {/* Pizza Base Preference */}
        <div className="form-group">
          <label>
            Pizza Base:
            <select
              value={preferences.pizza_base}
              onChange={(e) => setPreferences({ ...preferences, pizza_base: parseInt(e.target.value) })}
            >
              <option value={0}>Thin Crust</option>
              <option value={1}>Thick Crust</option>
              <option value={2}>Gluten-Free</option>
              <option value={3}>Regular</option>
            </select>
          </label>
        </div>

        {/* Favorite Sauce Preference */}
        <div className="form-group">
          <label>
            Favorite Sauce:
            <select
              value={preferences.favourite_sauce}
              onChange={(e) => setPreferences({ ...preferences, favourite_sauce: parseInt(e.target.value) })}
            >
              <option value={0}>Tomato</option>
              <option value={1}>Pesto</option>
              <option value={2}>White Sauce</option>
            </select>
          </label>
        </div>

        {/* Cheese Preference */}
        <div className="form-group">
          <label>
            Cheese Preference:
            <select
              value={preferences.cheese_preference}
              onChange={(e) => setPreferences({ ...preferences, cheese_preference: parseInt(e.target.value) })}
            >
              <option value={0}>Mozzarella</option>
              <option value={1}>Cheddar</option>
              <option value={2}>No Cheese</option>
              <option value={3}>Vegan Cheese</option>
            </select>
          </label>
        </div>

        {/* Toppings Selection */}
        <div className="form-group">
          <label>Preferred Toppings:</label>
          {[
            'pepperoni',
            'mushrooms',
            'onions',
            'olives',
            'bell_peppers',
            'chicken',
            'bacon',
            'ham',
            'pineapple',
            'basil',
            'jalapenos' // Fixed capitalization here
          ].map(topping => (
            <div key={topping}>
              <input
                type="checkbox"
                checked={preferences[`topping_${topping}`]}
                onChange={(e) => setPreferences({ ...preferences, [`topping_${topping}`]: e.target.checked })}
              /> {topping.charAt(0).toUpperCase() + topping.slice(1)}
            </div>
          ))}
        </div>

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

        <div className="form-group">
          <label>
            Is Gluten Free?
            <input
              type="checkbox"
              checked={preferences.is_gluten_free}
              onChange={(e) => setPreferences({ ...preferences, is_gluten_free: e.target.checked })}
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
              step="0.01"
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