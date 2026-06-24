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
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
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

// Task 10: Get all books using Promise
public_users.get('/books', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.status(200).json(JSON.stringify(books, null, 4)));
  });
  get_books.then(() => console.log("Task 10 Promise resolved"));
});

// Task 11: Get book details based on ISBN using Promise
public_users.get('/books/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const get_books_isbn = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("ISBN not found");
    }
  });
  get_books_isbn
    .then(function(book) {
      return res.status(200).json(book);
    })
    .catch(function(err) {
      return res.status(404).json({ message: err });
    });
});

// Task 12: Get book details based on Author using Promise
public_users.get('/books/author/:author', function (req, res) {
  const author = req.params.author;
  const get_books_author = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author === author) {
        booksbyauthor.push({ isbn, title: books[isbn].title, reviews: books[isbn].reviews });
      }
    });
    if (booksbyauthor.length > 0) {
      resolve(booksbyauthor);
    } else {
      reject("Author not found");
    }
  });
  get_books_author
    .then(function(result) {
      return res.status(200).json(result);
    })
    .catch(function(err) {
      return res.status(404).json({ message: err });
    });
});

// Task 13: Get book details based on Title using Promise
public_users.get('/books/title/:title', function (req, res) {
  const title = req.params.title;
  const get_books_title = new Promise((resolve, reject) => {
    let booksbytitle = [];
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title === title) {
        booksbytitle.push({ isbn, author: books[isbn].author, reviews: books[isbn].reviews });
      }
    });
    if (booksbytitle.length > 0) {
      resolve(booksbytitle);
    } else {
      reject("Title not found");
    }
  });
  get_books_title
    .then(function(result) {
      return res.status(200).json(result);
    })
    .catch(function(err) {
      return res.status(404).json({ message: err });
    });
});

module.exports.general = public_users;
