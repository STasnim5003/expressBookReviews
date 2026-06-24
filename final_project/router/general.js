const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });
  return res.status(200).json(booksByAuthor);
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  });
  return res.status(200).json(booksByTitle);
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

// Task 10: Get all books using async/await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book by ISBN using Promise with Axios
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(404).json({ message: "Book not found" });
    });
});

// Task 12: Get books by author using Promise with Axios
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(500).json({ message: "Error fetching books" });
    });
});

// Task 13: Get books by title using Promise with Axios
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(500).json({ message: "Error fetching books" });
    });
});

module.exports.general = public_users;
