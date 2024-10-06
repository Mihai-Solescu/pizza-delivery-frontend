import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Custom CSS for styling

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [preferences, setPreferences] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send registration data to the server
    try {
      await axios.post('http://localhost:8000/customers/register/', {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        address,
        postal_code: postalCode,
        city,
        password,
      });

      // If registration is successful, show the questionnaire
      setShowQuestionnaire(true);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const handleQuestionnaireSubmit = async () => {
    // Send the preferences data to the server
    try {
      await axios.post('http://localhost:8000/customers/preferences/', preferences);
      alert('Preferences saved!');
    } catch (error) {
      console.error('Error submitting preferences:', error);
    }
  };

  if (showQuestionnaire) {
    // Render the questionnaire form if registration is successful
    return (
      <div className="questionnaire-container">
        <h1>Questionnaire</h1>
        <form onSubmit={handleQuestionnaireSubmit}>
          <div className="form-group">
            <label>
              Do you prefer vegetarian pizzas?
              <input
                type="radio"
                name="vegetarian"
                value="yes"
                onChange={(e) => setPreferences({ ...preferences, vegetarian: e.target.value })}
              /> Yes
              <input
                type="radio"
                name="vegetarian"
                value="no"
                onChange={(e) => setPreferences({ ...preferences, vegetarian: e.target.value })}
              /> No
            </label>
          </div>

          <div className="form-group">
            <label>
              Favorite toppings:
              <input
                type="checkbox"
                name="toppings"
                value="cheese"
                onChange={(e) => setPreferences({ ...preferences, cheese: e.target.checked })}
              /> Cheese
              <input
                type="checkbox"
                name="toppings"
                value="pepperoni"
                onChange={(e) => setPreferences({ ...preferences, pepperoni: e.target.checked })}
              /> Pepperoni
              <input
                type="checkbox"
                name="toppings"
                value="mushrooms"
                onChange={(e) => setPreferences({ ...preferences, mushrooms: e.target.checked })}
              /> Mushrooms
            </label>
          </div>

          <button type="submit" className="btn-questionnaire">Submit Preferences</button>
        </form>
      </div>
    );
  }

  return (
    <div className="register-container">
      <h1 className="register-heading">Account Creation</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn-register">Submit (to questionnaire)</button>
      </form>
    </div>
  );
}

export default Register;
