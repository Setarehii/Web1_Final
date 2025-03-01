import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [editingNote, setEditingNote] = useState({});
  const [userEmail, setUserEmail] = useState(null);
  const [emailStatus, setEmailStatus] = useState("");
  const [userId, setUserId] = useState(""); 

  useEffect(() => {
    const storedUserEmail = localStorage.getItem("userEmail");
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  useEffect(() => {
    const fetchFavoriteBooks = async (id) => {
      if (!userId) {
        return;
      }
      try {L
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

  const handleRemoveFavorite = async (bookId) => {
    const confirmDelete = window.confirm(
      "Do you want to remove this book from your favorites?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/favorites/${bookId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove book from favorites");
      }
      setFavoriteBooks(favoriteBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error removing book from favorites:", error);
    }
  };

  const handleNoteChange = (bookId, newNote) => {
    setEditingNote({
      ...editingNote,
      [bookId]: newNote, 
    });
  };

  const handleUpdateNote = async (id, newNote) => {
    try {
      const currentBook = favoriteBooks.find((book) => book.id === id);
      const updatedNote = currentBook.note
        ? currentBook.note + "* \n " + newNote
        : newNote;

      const response = await fetch(`http://localhost:3000/favorites/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: updatedNote }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }
      setFavoriteBooks(
        favoriteBooks.map((book) =>
          book.id === id ? { ...book, note: updatedNote } : book
        )
      );

      if (userEmail) {
        const emailSent = await sendReminderEmail(userEmail);
        if (emailSent) {
          setEmailStatus("Reminder email sent successfully!");
        } else {
          setEmailStatus("Failed to send reminder email.");
        }
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (userEmail) {
        sendReminderEmail(userEmail); 
      }
    }, 60000); 
    return () => clearInterval(interval);
  }, [userEmail]);

  const sendReminderEmail = async (userEmail) => {
    try {
      const response = await fetch(
        "http://localhost:3000/send-daily-reminder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }), 
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send reminder email");
      }
      onsole.log("Reminder email sent successfully!");
      setEmailStatus("Reminder email sent successfully!"); // Update state to show success message
    } catch (error) {
      console.error("Error sending reminder email:", error);
      setEmailStatus("Failed to send reminder email."); // Update state to show error message
    }
  };

  return (
    <div className="profile-container">
      <div className="navbar">
        <div className="logo">Favorite Books</div>
        <ul>
          <li>
            <Link to="/booklist">View Books</Link>
          </li>
          <li>
            <Link to="/add-book">Add Book</Link>
          </li>
        </ul>
      </div>
      {emailStatus && <div className="email-status">{emailStatus}</div>}

      <div className="book-list">
        {favoriteBooks.length > 0 ? (
          favoriteBooks.map((book) => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => handleRemoveFavorite(book.id)}
            >
              <h2 className="book-title">{book.title}</h2>
              <h3 className="book-author">Author: {book.author}</h3>
              <p className="book-description">{book.description}</p>

              {book.note && (
                <div className="book-note">
                  <strong>Note:</strong> {book.note}
                </div>
              )}

              <div className="book-edit-note">
                <textarea
                  value={editingNote[book.id] || ""}
                  onChange={(e) => handleNoteChange(book.id, e.target.value)}
                  placeholder="Edit your note..."
                />
                <button
                  onClick={() =>
                    handleUpdateNote(book.id, editingNote[book.id] || "")
                  }
                >
                  Update Note
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No books in favorites.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
