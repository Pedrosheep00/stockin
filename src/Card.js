// This component is a card that displays the name, amount, and minimum of an item.
import React from 'react';
import './CSSs/Card.css'; 

const Card = ({ item }) => {
  return (
    <div className="Kard">
      <img src={item.imageUrl} alt={item.name} className="card-image"/>
      <div className="card-body">
        <h3 className="card-title">{item.name}</h3>
        <p className="card-text">Amount: {item.amount}</p>
        <p className="card-text">Minimum: {item.minimum}</p>
      </div>
    </div>
  );
};

export default Card;
