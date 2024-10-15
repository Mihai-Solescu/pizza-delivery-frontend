// src/pages/Earnings.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Earnings.css'; // Ensure this file exists for styling

function Earnings() {
  // State variables for filters
  const [gender, setGender] = useState('All');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [postalCode, setPostalCode] = useState(''); // New state for postal code

  // State variables for earnings data
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // For navigation in case of unauthorized access

  // Function to fetch earnings data based on filters
  const fetchEarnings = async () => {
    setLoading(true);
    setError('');
    setEarnings(null);

    const token = localStorage.getItem('accessToken'); // Assuming token is stored here

    // Construct query parameters
    const params = {};
    if (gender !== 'All') params.gender = gender;
    if (ageMin) params.age_min = ageMin;
    if (ageMax) params.age_max = ageMax;
    if (postalCode) params.postal_code = postalCode; // Include postal code if provided

    try {
      const response = await axios.get('http://localhost:8000/orders/earnings/', {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEarnings(response.data.Earnings);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        // If the user is not authorized, redirect to login
        navigate('/login');
      } else {
        setError('Failed to fetch earnings data.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchEarnings();
  };

  // Handle reset filters
  const handleReset = () => {
    setGender('All');
    setAgeMin('');
    setAgeMax('');
    setPostalCode('');
    setEarnings(null);
    setError('');
  };

  // Optionally, fetch earnings on component mount without filters
  useEffect(() => {
    fetchEarnings();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="earnings-container">
      <h1>Earnings Dashboard</h1>

      {/* Navigation Link Back to Normal Order */}
      <div className="back-link">
        <Link to="/normalorder">← Back to Normal Order</Link>
      </div>

      {/* Filter Form */}
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="filter-item">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-Binary">Non-Binary</option>
            {/* Add more gender options if needed */}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="ageMin">Min Age:</label>
          <input
            type="number"
            id="ageMin"
            value={ageMin}
            onChange={(e) => setAgeMin(e.target.value)}
            placeholder="e.g., 18"
            min="0"
          />
        </div>

        <div className="filter-item">
          <label htmlFor="ageMax">Max Age:</label>
          <input
            type="number"
            id="ageMax"
            value={ageMax}
            onChange={(e) => setAgeMax(e.target.value)}
            placeholder="e.g., 65"
            min="0"
          />
        </div>

        <div className="filter-item">
          <label htmlFor="postalCode">Postal Code:</label> {/* New postal code filter */}
          <input
            type="text"
            id="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="e.g., 12345"
          />
        </div>

        <div className="filter-buttons">
          <button type="submit" className="apply-filters-btn">Apply Filters</button>
          <button
            type="button"
            className="reset-filters-btn"
            onClick={handleReset}
          >
            Reset Filters
          </button>
        </div>
      </form>

      {/* Display Loading, Error, or Earnings */}
      <div className="earnings-result">
        {loading && <p>Loading earnings data...</p>}
        {error && <p className="error-message">{error}</p>}
        {earnings !== null && !loading && !error && (
          <div className="earnings-display">
            <h2>Total Earnings: €{earnings.toLocaleString()}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Earnings;