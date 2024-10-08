import { useState, useEffect } from 'react';
import './Account.css';
import { Link } from "react-router-dom";
import axios from 'axios';

const Account = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Dummy data to simulate registration information
  const [userInfo, setUserInfo] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    address: "",
  });

  // useEffect hook to run when the component is mounted
  useEffect(() => {
    const downloadFile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/customers/customer_info/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // If your endpoint requires authentication
          },
        });

        const modifiedData = {
        ...response.data, // Keep the original data
        username: localStorage.getItem("userName") // Add the username to the data
        };

        console.log(modifiedData)
        setUserInfo(modifiedData);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    };

    // Call the function
    downloadFile();
  }, []); // Empty dependency array to run this only once when the component mounts

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="account-wrapper"> {/* Added wrapper div */}
      <div className="account-page">
        {/* Header with user info and hamburger menu */}
        <div className="header">
          <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
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
          <div className="username">{localStorage.getItem("userName")}</div>
          <div className="shopping-cart">
            <Link to="/cart">🛒</Link>
          </div>
        </div>

        {/* Displaying user information */}
        <h2>User Information</h2>
        <div className="user-info">
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>First name:</strong> {userInfo.first_name}</p>
          <p><strong>Last name:</strong> {userInfo.last_name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Address:</strong> {userInfo.address}</p>
        </div>

        {/* Navigation buttons moved to footer */}
        <div className="bottom-nav">
          <Link to="/normalorder" className="nav-btn">Normal</Link>
          <Link to="/quickorder" className="nav-btn">Quick</Link>
        </div>
      </div>
    </div>
  );
};

export default Account;
