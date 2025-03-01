import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; 
import './Booking.css'; 
import bookImage from './book.png';

const Booking = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; 
    setIsSubmitting(true);

    if (!title || !author || !publisher || !year || !description || !genre) {
      setError('Please fill in all the fields.');
      setIsSubmitting(false);
      return;
    }

    const newBook = {
      title,
      author,
      publisher,
      year,
      description,
      genre,  
      note: '',  
      likes: 0,
      dislikes: 0,  
    };

    try {
      const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        alert("Book added successfully!");
        setError('');
        setSuccess('Book added successfully!');
        setTitle('');
        setAuthor('');
        setPublisher('');
        setYear('');
        setDescription('');
        setGenre('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add book.');
        setSuccess('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while adding the book.');
      setSuccess('');
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="booking-container">
      <div className="navbar">
        <div className="logo">Add Book</div>
        <ul>
          <li>
            <Link to="/booklist">Book List</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/goal">Goal Reading</Link>
          </li>
        </ul>
      </div>
      <div className="form-container">
        <div className="booking-form">
          <h2>Add a New Book</h2>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <div className="form-field">
              <label htmlFor="title">Book Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
              />
            </div>

            <div className="form-field">
              <label htmlFor="author">Author Name:</label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
              />
            </div>

            {/* Genre Selector */}
            <div className="form-field">
              <label htmlFor="genre">Genre:</label>
              <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-fiction">Non-fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Mystery">Mystery</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="publisher">Publisher:</label>
              <input
                type="text"
                id="publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Enter publisher"
              />
            </div>

            <div className="form-field">
              <label htmlFor="year">Publication Year:</label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Enter publication year"
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter book description"
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Book...' : 'Add Book'}
            </button>
          </form>
        </div>

        <div className="booking-image">
          <img src={bookImage} alt="Book" />
        </div>
      </div>
    </div>
  );
};

export default Booking;
