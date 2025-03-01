import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import "./BookList.css";

const BookList = ({ onAddFavorite }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    genre: "",
    rating: "",
    author: "",
  });
  const [originalBooks, setOriginalBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [likedBooks, setLikedBooks] = useState({});
  const [dislikedBooks, setDislikedBooks] = useState({});
  const [likedDates, setLikedDates] = useState({});
  const [dislikedDates, setDislikedDates] = useState({});
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:3000/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const books = await response.json();
        
        setOriginalBooks(books);
        setFilteredBooks(books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    console.log(userId);
    fetchBooks();
  });

  useEffect(() => {
    const fetchBookLikesDislikes = async () => {
      try {
        const response = await fetch("http://localhost:3000/books");
        const books = await response.json();

        const likes = {};
        const dislikes = {};
        const likeDates = {};
        const dislikeDates = {};

        books.forEach((book) => {
          likes[book.id] = book.likes || 0;
          dislikes[book.id] = book.dislikes || 0;
          likeDates[book.id] = book.likeDate || "";
          dislikeDates[book.id] = book.dislikeDate || "";
        });

        setLikedBooks(likes);
        setDislikedBooks(dislikes);
        setLikedDates(likeDates);
        setDislikedDates(dislikeDates);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBookLikesDislikes();
  }, []);

  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    const fetchFavoriteBooks = async (id) => {
      if (!userId) {
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/favorites/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch favorite books");
        }

        const books = await response.json();
        setFavoriteBooks(books);
      } catch (error) {
        console.error("Error fetching favorite books:", error);
      }
    };
    const id = userId; 
    fetchFavoriteBooks(id);
  }, [userId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleSearch = () => {
    const result = originalBooks.filter((book) => {
      return (
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filter.genre ? book.genre === filter.genre : true) &&
        (filter.rating ? book.rating >= filter.rating : true) &&
        (filter.author
          ? book.author.toLowerCase().includes(filter.author.toLowerCase())
          : true)
      );
    });
    setFilteredBooks(result);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilter({
      genre: "",
      rating: "",
      author: "",
    });
    setFilteredBooks(originalBooks);
  };

  const updateBookInDatabase = async (id, updates) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        console.log("Book updated successfully");
      }
      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      const updatedBook = await response.json();
      console.log("Book updated:", updatedBook);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleLike = (id) => {
    const currentLikes = likedBooks[id] || 0;
    const updatedLikes = currentLikes + 1;

    const updatedDislikes = dislikedBooks[id] || 0;

    const currentDate = new Date().toLocaleDateString();

    setLikedBooks((prevLikes) => ({
      ...prevLikes,
      [id]: updatedLikes,
    }));

    setDislikedBooks((prevDislikes) => ({
      ...prevDislikes,
      [id]: updatedDislikes,
    }));

    setLikedDates((prevDates) => ({
      ...prevDates,
      [id]: currentDate,
    }));

    setDislikedDates((prevDates) => ({
      ...prevDates,
      [id]: "",
    }));

    updateBookInDatabase(id, {
      likes: updatedLikes,
      dislikes: updatedDislikes,
    });
  };

  const handleDislike = (id) => {
    const currentDislikes = dislikedBooks[id] || 0;
    const updatedDislikes = currentDislikes + 1;

    const updatedLikes = likedBooks[id] || 0;
    const currentDate = new Date().toLocaleDateString();

    setDislikedBooks((prevDislikes) => ({
      ...prevDislikes,
      [id]: updatedDislikes,
    }));

    setLikedBooks((prevLikes) => ({
      ...prevLikes,
      [id]: updatedLikes,
    }));

    setLikedDates((prevDates) => ({
      ...prevDates,
      [id]: "",
    }));

    setDislikedDates((prevDates) => ({
      ...prevDates,
      [id]: currentDate,
    }));

    updateBookInDatabase(id, {
      likes: updatedLikes,
      dislikes: updatedDislikes,
    });
  };

  const handleFavorite = async (bookId) => {
    const currentDate = new Date().toLocaleDateString();
    const currentBook = originalBooks.find((book) => book.id === bookId);

    const isAlreadyFavorite = favoriteBooks.some(
      (favorite) => favorite.bookid === currentBook.id
    );
    if (isAlreadyFavorite) {
      console.log("This book is already in your favorites.");
      <button disabled={isAlreadyFavorite} className="favorite-button">
        {isAlreadyFavorite ? "Favorited" : "Add to Favorites"}
      </button>;
      return;
    }

    setFavorites((prevFavorites) => {
      const updatedFavorites = [...prevFavorites, bookId];
      setFavoriteBooks((prevFavoriteBooks) => [
        ...prevFavoriteBooks,
        {
          bookid: currentBook.id,
          title: currentBook.title,
          author: currentBook.author,
          description: currentBook.description,
          dateAdded: currentDate,
        },
      ]);
      return updatedFavorites;
    });

    const favoriteData = {
      userid: userId,
      bookid: currentBook.id,
      title: currentBook.title,
      author: currentBook.author,
      description: currentBook.description,
      dateAdded: currentDate,
    };

    try {
      const response = await fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(favoriteData),
      });

      if (!response.ok) {
        throw new Error("Failed to add favorite");
      }

      console.log("Favorite added successfully");
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  return (
    <div className="book-list-container">
      <div className="navbar">
        <div className="logo">BookList</div>
        <ul>
          <li>
            <Link to="/add-book">Add Book</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/goal">Goal Reading</Link>
          </li>
          <li>
            <Link to="/">Log out</Link>
          </li>
        </ul>
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />

        <select
          name="genre"
          value={filter.genre}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Select Genre</option>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-fiction</option>
          <option value="fantasy">Fantasy</option>
          <option value="science-fiction">Science Fiction</option>
        </select>

        <select
          name="rating"
          value={filter.rating}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Select Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
        </select>

        <input
          type="text"
          name="author"
          placeholder="Search by author"
          value={filter.author}
          onChange={handleFilterChange}
          className="search-input"
        />

        <div>
          <button onClick={handleSearch} className="search-button">
            Search
          </button>

          <button onClick={handleClear} className="clear-button">
            Clear
          </button>
        </div>
      </div>

      <div className="book-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <div key={index} className="book-card">
              <h2 className="book-title">{book.title}</h2>
              <h3 className="book-author">Author: {book.author}</h3>
              <p className="book-genre">Genre: {book.genre}</p>
              <p className="book-rating">Rating: {book.rating} stars</p>
              <p className="book-description">{book.description}</p>

              <div className="like-dislike">
                <button
                  onClick={() => handleLike(book.id)}
                  className="like-button"
                >
                  👍 Like ({likedBooks[book.id] || 0})
                </button>
                <button
                  onClick={() => handleDislike(book.id)}
                  className="dislike-button"
                >
                  👎 Dislike ({dislikedBooks[book.id] || 0})
                </button>
              </div>

              <button
                onClick={() => handleFavorite(book.id)}
                disabled={favoriteBooks.some(
                  (favorite) => favorite.bookid === book.id
                )}
                className="favorite-button"
              >
                {favoriteBooks.some((favorite) => favorite.bookid === book.id)
                  ? "Favorited"
                  : "Add to Favorites"}
              </button>
            </div>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
