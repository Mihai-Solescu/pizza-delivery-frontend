import { useState, useEffect } from 'react';

// Modal component for displaying pizza details
function MomentaryPreferences({ onClose, onQuickOrder, preferences, setPreferences }) {
    const [budget, setBudget] = useState(preferences.max_budget);
    const [selectedAnswers, setSelectedAnswers] = useState({
      spicy: 0.0,
      sweet: 0.0,
      cheesy: 0.0,
      salty: 0.0,
      is_vegetarian: false,
      is_vegan: false,
    });
  
    // Check if all questions have been answered
    const allQuestionsAnswered = Object.values(selectedAnswers).every(answer => answer !== null);
  
    const handleInputChange = (filterName, value) => {
      setPreferences(prevPreferences => ({
        ...prevPreferences,
        [filterName]: value
      }));
  
      // Update the selected answers
      setSelectedAnswers(prev => ({
        ...prev,
        [filterName]: value
      }));
    };
  
    const handleBudgetChange = (e) => {
      setBudget(e.target.value);
      setPreferences(prevPreferences => ({
        ...prevPreferences,
        max_budget: e.target.value
      }));
    };
  
    return (
      <div className="advise-overlay">
        <div className="advise-content">
          <button className="close-button" onClick={onClose}>X</button>
          <h2>Momentary Preferences</h2>
          <h3>Answer the following questions:</h3>
  
          <div className="question-section">
            <p>Are you into something spicy right now?</p>
            <button
              className={selectedAnswers.spicy === 1 ? 'highlighted' : ''}
              onClick={() => handleInputChange('spicy', 1)}
            >
              Yes
            </button>
            <button
              className={selectedAnswers.spicy === 0 ? 'highlighted' : ''}
              onClick={() => handleInputChange('spicy', 0)}
            >
              No
            </button>
  
            <p>Do you want something sweet on your pizza?</p>
            <button
              className={selectedAnswers.sweet === 1 ? 'highlighted' : ''}
              onClick={() => handleInputChange('sweet', 1)}
            >
              Yes
            </button>
            <button
              className={selectedAnswers.sweet === 0 ? 'highlighted' : ''}
              onClick={() => handleInputChange('sweet', 0)}
            >
              No
            </button>
  
            <p>Do you want a cheesy pizza?</p>
            <button
              className={selectedAnswers.cheesy === 1 ? 'highlighted' : ''}
              onClick={() => handleInputChange('cheesy', 1)}
            >
              Yes
            </button>
            <button
              className={selectedAnswers.cheesy === 0 ? 'highlighted' : ''}
              onClick={() => handleInputChange('cheesy', 0)}
            >
              No
            </button>
  
            <p>Do you want something salty on your pizza?</p>
            <button
              className={selectedAnswers.salty === 1 ? 'highlighted' : ''}
              onClick={() => handleInputChange('salty', 1)}
            >
              Yes
            </button>
            <button
              className={selectedAnswers.salty === 0 ? 'highlighted' : ''}
              onClick={() => handleInputChange('salty', 0)}
            >
              No
            </button>
  
            <p>Are you into vegetarian options right now?</p>
            <button
              className={selectedAnswers.is_vegetarian === true ? 'highlighted' : ''}
              onClick={() => handleInputChange('is_vegetarian', true)}
            >
              Yes
            </button>
            <button
              className={selectedAnswers.is_vegetarian === false ? 'highlighted' : ''}
              onClick={() => handleInputChange('is_vegetarian', false)}
            >
              No
            </button>
  
            <p>Are you looking for a vegan pizza?</p>
            <button
              className={selectedAnswers.is_vegan === true ? 'highlighted' : ''}
              onClick={() => handleInputChange('is_vegan', true)}
            >
              Yes
            </button>
            <button
              className={selectedAnswers.is_vegan === false ? 'highlighted' : ''}
              onClick={() => handleInputChange('is_vegan', false)}
            >
              No
            </button>
  
            <p>What's your max budget for the pizza?</p>
            <input
              type="number"
              value={budget}
              onChange={handleBudgetChange}
              placeholder="Enter max budget"
            />
          </div>
  
          <button
            onClick={() => onQuickOrder(preferences)}
            disabled={!allQuestionsAnswered} // Disable the button if not all questions are answered
            className={`confirm-button ${allQuestionsAnswered ? '' : 'disabled'}`} // Apply 'disabled' class if needed
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }

export default MomentaryPreferences;