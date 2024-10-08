import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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
  const [error, setError] = useState(''); // State to store registration error

  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send registration data to the server
    try {
      // First register the user
      const address_data = [city, address, postalCode]
      await axios.post('http://localhost:8000/customers/register/', {
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
        email: email,
        address: address_data.join(', '),
      });

      // If registration is successful, log the user in immediately
      const response = await axios.post('http://localhost:8000/customers/login/', {
        username,
        password,
      });

      // Get the tokens from the response and store them
      const { refresh, access } = response.data;  // Destructuring the response data
      localStorage.setItem('accessToken', access);  // Save access token
      localStorage.setItem('refreshToken', refresh);  // Save refresh token

      // Navigate to the preferences page or another desired page
      navigate('/preferences');
    } catch (error) {
      console.error('Error during registration or login:', error);
      setError('Registration failed. Please try again.'); // Set error message
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-heading">Account Creation</h1>
      {error && <p className="register-error">{error}</p>} {/* Display error if exists */}
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