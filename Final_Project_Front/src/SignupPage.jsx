import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignupPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    genre: "",
    age: "",
    language: "",
    customLanguage: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    genre: "",
    age: "",
    language: "",
    customLanguage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCustomLanguageChange = (e) => {
    setFormData({
      ...formData,
      customLanguage: e.target.value,
    });
  };

  const validateForm = () => {
    let formIsValid = true;
    let tempErrors = { ...errors };

    if (!formData.firstName) {
      formIsValid = false;
      tempErrors.firstName = "First name is required";
    } else {
      tempErrors.firstName = "";
    }

    if (!formData.lastName) {
      formIsValid = false;
      tempErrors.lastName = "Last name is required";
    } else {
      tempErrors.lastName = "";
    }

    if (!formData.email) {
      formIsValid = false;
      tempErrors.email = "Email is required";
    } else if (!formData.email.includes("@gmail.com")) {
      formIsValid = false;
      tempErrors.email = "Please enter a valid Gmail address";
    } else {
      tempErrors.email = "";
    }

    if (!formData.password) {
      formIsValid = false;
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      formIsValid = false;
      tempErrors.password = "Password must be at least 6 characters";
    } else {
      tempErrors.password = "";
    }

    if (!formData.genre) {
      formIsValid = false;
      tempErrors.genre = "Book genre is required";
    } else {
      tempErrors.genre = "";
    }

    if (!formData.age) {
      formIsValid = false;
      tempErrors.age = "Age is required";
    } else if (formData.age <= 0) {
      formIsValid = false;
      tempErrors.age = "Age must be greater than 0";
    } else {
      tempErrors.age = "";
    }

    if (!formData.language && !formData.customLanguage) {
      formIsValid = false;
      tempErrors.language = "Please select or add a language";
    } else {
      tempErrors.language = "";
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const finalLanguage = formData.language || formData.customLanguage;

      try {
        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, language: finalLanguage }),
        });

        if (response.ok) {
          alert("User added successfully!");

          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            genre: "",
            age: "",
            language: "",
            customLanguage: "",
          });
          navigate("/");
        } else {
          alert("Failed to add user.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error adding user.");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <span className="error">{errors.firstName}</span>
          )}
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div>
          <select name="genre" value={formData.genre} onChange={handleChange}>
            <option value="">Select Genre</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Mystery">Mystery</option>
          </select>
          {errors.genre && <span className="error">{errors.genre}</span>}
        </div>

        <div>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <span className="error">{errors.age}</span>}
        </div>

        <div>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
          >
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
          </select>
          {errors.language && <span className="error">{errors.language}</span>}
        </div>
        <div>
          <input
            type="text"
            name="customLanguage"
            placeholder="Or add your own language"
            value={formData.customLanguage}
            onChange={handleCustomLanguageChange}
          />
          {errors.customLanguage && (
            <span className="error">{errors.customLanguage}</span>
          )}
        </div>

        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default SignUpPage;
