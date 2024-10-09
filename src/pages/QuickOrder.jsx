import { useState } from 'react';
import { Link } from 'react-router-dom';
import './QuickOrder.css'; // Custom styles for pizza card
import BRB from '../assets/BRB.png'; // Import the pizza logo

// Modal component for displaying pizza details
function Questionary_Advise_popup({onClose}) {
  return (
    <div className="advise-overlay" onClick={onClose}>
      <div className="advise-content">
          <button className="close-button" onClick={onClose}>X</button>
          <h2>Do you want to pass small questionary?</h2>
          <h3>Preferences will be used by default</h3>
          <div className="option-buttons">
            <button className="refuse-btn"> Skip(use default) </button>
            <Link to="/quickOrderQuestionarry" className="accept-btn"> Pass </Link>
          </div>
      </div>
    </div>
  );
}

function QuickOrder() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Controls the modal display

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to handle pizza click and open the modal
  const handleBRBClick = () => {
      console.log("Big Red Button clicked!");
      setShowPopup(true);  // Show the modal
      console.log(showPopup);
  };

  // Function to close the modal
  const handleClosePopup = () => {
      console.log("Close Button clicked!");
      setShowPopup(false);  // Hide the modal
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
                {/* Shopping Cart Icon */}
                <div className="shopping-cart">
                    <Link to="/cart">🛒</Link>
                </div>
                <div className="username">{localStorage.getItem("userName")}</div>
            </div>

            <div className="nav-buttons">
                <Link to="/normalorder" className="nav-btn-normal">Normal</Link>
                <Link to="/quickorder" className="nav-btn-quick">Quick</Link>
            </div>
        </div>
      </header>
        {/* Big Red Button */}
      <div className="big-red-button-container">
        <button className="big-red-button" onClick={() => handleBRBClick()}>
          <img src={BRB} alt="Big Red Button" />
        </button>
      </div>
        {/* Show the modal if a pizza is selected */}
        {showPopup && <Questionary_Advise_popup onClose={handleClosePopup} />}
    </div>
  );
}

export default QuickOrder;