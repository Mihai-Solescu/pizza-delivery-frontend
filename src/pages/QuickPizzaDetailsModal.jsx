import React, { useState } from 'react';

function QuickPizzaDetailsModal({ pizza, onClose, handleRating }) {
    const defaultPizzaImage = "https://media.istockphoto.com/id/1671506157/nl/foto/slice-of-pizza-melted-cheese-stretches-from-the-piece.jpg?s=2048x2048&w=is&k=20&c=rEGVINGvZneoC6KtYBtB11ySq6cqD6nAhjMdgtyrkIA=";
  
    const [userRating, setUserRating] = useState(pizza.rating || 0);
  
    const handleRatingChange = (newRating) => {
      setUserRating(newRating);
      handleRating(pizza.id, newRating);
    };
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h1>{pizza.name}</h1>
            <button className="close-button" onClick={onClose}>X</button>
          </div>
          <img src={defaultPizzaImage} alt={pizza.name} className="details-pizza-image" />
          <p><strong>Description:</strong> {pizza.description || 'No description available'}</p>
          <p><strong>Price:</strong> {pizza.price} €</p>
          <p><strong>Vegan:</strong> {pizza.is_vegan ? 'Yes' : 'No'}</p>
          <p><strong>Vegetarian:</strong> {pizza.is_vegetarian ? 'Yes' : 'No'}</p>
          <p><strong>Ingredients:</strong></p>
          <div className="ingredient-list">
            <ul>
              {pizza.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.name} - {ingredient.price} €</li>
              ))}
            </ul>
          </div>
  
          <div className="rating-section">
            <strong>Rating:</strong>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= userRating ? 'star filled' : 'star'}
                  onClick={() => handleRatingChange(star)}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default QuickPizzaDetailsModal;