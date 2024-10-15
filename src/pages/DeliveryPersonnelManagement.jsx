import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeliveryPersonnelManagement.css'; // Optional: For styling

const DeliveryPersonnelManagement = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');

  // Fetch all delivery personnel on component mount
  useEffect(() => {
    fetchAllDeliveryPersons();
  }, []);

  // Function to fetch all delivery personnel
  const fetchAllDeliveryPersons = async () => {
    try {
      const response = await axios.get('http://localhost:8000/delivery/delivery-persons/');
      setDeliveryPersons(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error fetching delivery personnel.');
    }
  };

  // Function to fetch available delivery personnel by postal code
  const fetchAvailableDeliveryPersons = async () => {
    try {
      const response = await axios.get('http://localhost:8000/delivery/delivery-persons/available/', {
        params: { postal_code: postalCode },
      });
      setDeliveryPersons(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error fetching available delivery personnel.');
    }
  };

  // Handle filter form submission
  const handleFilter = (e) => {
    e.preventDefault();
    if (postalCode.trim() === '') {
      fetchAllDeliveryPersons();
    } else {
      fetchAvailableDeliveryPersons();
    }
  };

  // Handle resetting the filter
  const handleReset = () => {
    setPostalCode('');
    fetchAllDeliveryPersons();
  };

  // Function to determine availability
  const isAvailable = (person) => {
    if (!person.last_dispatched) return true;
    const lastDispatched = new Date(person.last_dispatched);
    const now = new Date();
    const diffInMinutes = (now - lastDispatched) / (1000 * 60);
    return diffInMinutes >= 30;
  };

  // Function to set a delivery person as available
  const handleSetAvailable = async (personId) => {
    try {
      await axios.post(`http://localhost:8000/delivery/delivery-persons/${personId}/set_available/`);
      fetchAllDeliveryPersons(); // Refresh the list after updating
    } catch (err) {
      console.error(err);
      alert('Failed to set delivery person as available.');
    }
  };

  return (
    <div className="delivery-personnel-container">
      <h1>Delivery Personnel Management</h1>

      {/* Filter Form */}
      <form onSubmit={handleFilter} className="filter-form">
        <input
          type="text"
          placeholder="Enter Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <button type="submit">Filter</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Delivery Personnel Table */}
      <table className="delivery-personnel-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Postal Area</th>
            <th>Last Dispatched</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveryPersons.length > 0 ? (
            deliveryPersons.map((person) => (
              <tr key={person.delivery_person_id}>
                <td>{person.name}</td>
                <td>{person.postal_area}</td>
                <td>{person.last_dispatched ? new Date(person.last_dispatched).toLocaleString() : 'Never'}</td>
                <td>{isAvailable(person) ? 'Available' : 'Unavailable'}</td>
                <td>
                  {!isAvailable(person) && (
                    <button onClick={() => handleSetAvailable(person.delivery_person_id)}>Set Available</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No delivery personnel found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryPersonnelManagement;