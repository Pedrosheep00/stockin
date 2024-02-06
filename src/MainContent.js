// src/MainContent.js
import React from 'react';
import './CSSs/MainContent.css';

const MainComponent = () => {
  const generateSquares = (count) => {
    const squares = [];
    for (let i = 1; i <= count; i++) {
      squares.push(
        <div className="square" key={i}>
          <div className="pictures"></div>
          <div className="content">
            <h3 className="name">Name</h3>
            <p className="number">{i}</p>
          </div>
        </div>
      );
    }
    return squares;
  };

  return (
    <div>
      <div className="button-container">
        <div className="prev_page_button"></div>
        <div className="itemsBg">
          {generateSquares(14)}
        </div>
        <div className="next_page_button"></div>
      </div>
    </div>
  );
}

export default MainComponent;
