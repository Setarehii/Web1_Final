const express = require("express");
const { neon } = require("@neondatabase/serverless");
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (_, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

DATABASE_URL =
  "postgresql://neondb_owner:npg_Kue0ItVU8LPw@ep-muddy-feather-a8mx8kzx-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

const port = 3000;

app.post("/users", async (request, response) => {
  const {
    firstName,
    lastName,
    email,
    password,
    genre,
    age,
    language,
    customLanguage,
  } = request.body;
  try {
    const result = await sql`
        INSERT INTO users (first_name, last_name, email, password, genre, age, language, custom_language)
        VALUES (${firstName}, ${lastName}, ${email}, ${password}, ${genre}, ${age}, ${language}, ${customLanguage})
        RETURNING *;`;
    response
      .status(201)
      .json({ message: "User added successfully", user: result[0] });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to add user" });
  }
});

app.get("/search-users", async (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password." });
  }

  try {
    const query = `
            SELECT * FROM users WHERE email = '${email}' AND password = '${password}'
        `;

    const result = await sql(query);

    if (result.length === 0) {
      return res.json([]);
    }
    res.json(result);
  } catch (error) {
    console.error("Database query error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

app.post("/books", async (request, response) => {
  const {
    title,
    author,
    publisher,
    genre,
    year,
    description,
    note,
    likes,
    dislikes,
  } = request.body;

  try {
    const result = await sql`
            INSERT INTO books (title, author, publisher,genre, year, description, note, likes, dislikes)
            VALUES (${title}, ${author}, ${publisher}, ${genre}, ${year}, ${description}, ${note}, ${likes}, ${dislikes})
            RETURNING *;`;

    response
      .status(201)
      .json({ message: "Book added successfully", book: result[0] });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to add book" });
  }
});

app.post("/reading-goals", async (request, response) => {
  const {
    user_id,
    timeframe,
    goal,
    current_total,
    progress,
    start_date,
    end_date,
  } = request.body;

  try {
    const result = await sql`
            INSERT INTO reading_goals (user_id, timeframe, goal, current_total, progress, start_date, end_date)
            VALUES (${user_id}, ${timeframe}, ${goal}, ${current_total}, ${progress}, ${start_date}, ${end_date})
            RETURNING *;`;

    response
      .status(201)
      .json({
        message: "Reading goal added successfully",
        readingGoal: result[0],
      });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to add reading goal" });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { likes, dislikes,note } = req.body;
    const query = await sql`
      UPDATE books SET likes = ${likes}, dislikes = ${dislikes}, note = ${note} WHERE id = ${bookId};
`;
    res.send(query);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/favorites/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const query = await sql`
      DELETE FROM favorites WHERE id = ${bookId};
`;
    res.send(query);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/favorites/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { note } = req.body;
    const query = await sql`
      UPDATE favorites SET note = ${note} WHERE id = ${bookId};
`;
    res.send(query);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/favorites/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const query = await sql`
      SELECT * FROM favorites WHERE userid = ${userId};
`;
    res.send(query);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users", async (request, response) => {
  try {
    const users = await sql`SELECT * FROM users;`;

    response.send(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    response.status(500).json({ message: "Failed to retrieve users" });
  }
});

app.get("/favorites", async (request, response) => {
  try {
    const favorites = await sql`SELECT * FROM favorites;`;

    response.send(favorites);
  } catch (error) {
    console.error("Error retrieving users:", error);
    response.status(500).json({ message: "Failed to retrieve users" });
  }
});

app.get("/books", async (request, response) => {
  try {
    const books = await sql`SELECT * FROM books;`;
    console.log(books);
    response.send(books);
  } catch (error) {
    console.error("Error retrieving users:", error);
    response.status(500).json({ message: "Failed to retrieve users" });
  }
});
app.get("/search-users", async (req, res) => {
  const { email, password } = req.query;

  try {
    const users = await sql`SELECT * FROM users`;
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Incorrect email or password." });
    }
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/favorites", async (request, response) => {
  const {
    userid,
    bookid,
    title,
    author,
    description,
    note,
    dateAdded,
  } = request.body;

  try {
    const result = await sql`
            INSERT INTO favorites (userid, bookid, title, author, description, note, dateAdded)
            VALUES (${userid}, ${bookid}, ${title}, ${author}, ${description}, ${note}, ${dateAdded})
            RETURNING *;`;

    response
      .status(201)
      .json({ message: "Favorite added successfully", favorite: result[0] });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to add favorite" });
  }
});

const sendReminder = async (userEmail) => {
  console.log('Reminder: Time to read your daily book!');
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "setarehizadi18@gmail.com",
      pass: "uffk mrnf tehz espg",
    },
  });

  let mailOptions = {
    from: 'setarehizadi18@gmail.com',
    to: userEmail, 
    subject: 'Daily Reading Reminder',
    text: 'It\'s time to read your daily book! Make sure you dedicate some time to study.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    sendReminder(email); 
    return res.status(200).json({ message: 'Email sent successfully!',email });
  });
};

app.post('/send-daily-reminder', (req, res) => {
  const { email } = req.body; 
  sendReminder(email);
  res.status(200).send('Reminder sent successfully!');
});

app.listen(port, () =>
  console.log(` My App listening at http://localhost:${port}`)
);
