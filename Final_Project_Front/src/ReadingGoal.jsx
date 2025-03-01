import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ReadingGoal.css"; 

const ReadingGoal = () => {
  const [timeframe, setTimeframe] = useState(""); 
  const [goal, setGoal] = useState("");
  const [progress, setProgress] = useState([]);
  const [currentTotal, setCurrentTotal] = useState(0);

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
    setGoal(""); 
    setProgress([]);
    setCurrentTotal(0);
  };

  const handleGoalChange = (event) => {
    const value = Number(event.target.value);
    if (value >= 0) {
      setGoal(value);
    }
  };

  const handleAddProgress = () => {
    const pagesRead = parseInt(prompt("Enter pages read today:"), 10);
    if (!isNaN(pagesRead) && pagesRead > 0) {
      const newTotal = currentTotal + pagesRead;
      setCurrentTotal(newTotal);
      setProgress([...progress, pagesRead]);
    }
  };

  return (
    <dive>
      <div className="navbar">
        <div className="logo">Goal Reading</div>
        <ul>
          <li>
            <Link to="/booklist">View Books</Link>
          </li>
          <li>
            <Link to="/add-book">Add Book</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </div>
    <div className="goal-container">
           

      <h1>Set Your Reading Goal</h1>
      <label>Select your timeframe:</label>
      <select value={timeframe} onChange={handleTimeframeChange}>
        <option value="">-- Select --</option>
        <option value="week">Per Week</option>
        <option value="month">Per Month</option>
      </select>

      <label>Enter your reading goal (pages per {timeframe}):</label>
      <input
        type="number"
        value={goal}
        onChange={handleGoalChange}
        placeholder="Enter number of pages"
        min={0}
        disabled={!timeframe}
      />

      <button onClick={handleAddProgress} disabled={!goal}>
        Log Today's Pages
      </button>

      <h2>Progress</h2>
      <p>
        You have read <strong>{currentTotal}</strong> pages out of{" "}
        <strong>{goal || 0}</strong> pages {timeframe && `this ${timeframe}`}.
      </p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: goal ? `${(currentTotal / goal) * 100}%` : "0%" }}
        ></div>
      </div>

      <ul className="progress-list">
        {progress.map((pages, index) => (
          <li key={index}>Day {index + 1}: {pages} pages</li>
        ))}
      </ul>
    </div></dive>
  );
};

export default ReadingGoal;
