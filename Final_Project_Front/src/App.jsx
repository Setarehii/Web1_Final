import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'; 
import './App.css';
import ReadingGoal from './ReadingGoal';
import Booking from './Booking';
import BookList from './BookList';
import Profile from './Profile'; 
import LoginPage from './LoginPage'; 
import SignUpPage from './SignupPage';

const App = () => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  const addBook = (newBook) => {
    setBooks([...books, newBook]);
  };

  const handleAddFavorite = (bookId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(bookId)) {
        return prevFavorites.filter((id) => id !== bookId); 
      } else {
        return [...prevFavorites, bookId]; 
      }
    });
  };

  const handleLogin = (userData) => {
    setUser(userData); 
  };

  const handleLogout = () => {
    setUser(null); 
  };

  return (
    <Router>
      <div className="app-container">
        {user && (
          <nav className="navbar">
            <div className="logo">BookStore</div>
            <ul className="nav-links">
              <li>
                <Link to="/BookList">View Books</Link>
              </li>
              <li>
                <Link to="/add-book">Add Book</Link>
              </li>
              <li>
                <Link to="/goal">Reading Goal</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/">Log out</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </nav>
        )}

        <Routes>
          <Route path="/booklist" element={<BookList books={books} onAddFavorite={handleAddFavorite} />} />
          <Route path="/add-book" element={<Booking addBook={addBook} />} />
          <Route path="/goal" element={<ReadingGoal />} />
          <Route path="/profile" element={<Profile favorites={favorites} books={books} />} />
          <Route path="/" element={user ? <Navigate to="/booklist" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
