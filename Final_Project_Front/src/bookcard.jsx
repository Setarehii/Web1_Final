import React from 'react';

const bookCard = ({ title, author, description, imageUrl }) => {
  return (
    <div className="book-card">
      {imageUrl && <img src={imageUrl} alt={title} className="book-image" />}
      <h2 className="book-title">{title}</h2>
      <h3 className="book-author">{author}</h3>
      <p className="book-description">{description}</p>
    </div>
  );
};

export default bookCard;
