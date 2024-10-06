import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; // React Bootstrap for modal
import './PizzaItem.css'; // Custom styles

function PizzaItem({ pizza }) {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div className="pizza-item">
      <img src={pizza.image} alt={pizza.name} className="pizza-image" />
      <div className="pizza-details">
        <h3 className="pizza-name">{pizza.name}</h3>
        <p className="pizza-price">{pizza.price} €</p>
        <button className="more-info-btn" onClick={handleShow}>
          More Info
        </button>
      </div>

      {/* Modal for displaying pizza details */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{pizza.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Full Description</h4>
          <p>{pizza.description}</p>
          
          <h4>Ingredients</h4>
          <ul>
            {pizza.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <h4>Reviews</h4>
          <div className="pizza-reviews">
            {pizza.reviews.map((review, index) => (
              <p key={index}>{review}</p>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PizzaItem;
