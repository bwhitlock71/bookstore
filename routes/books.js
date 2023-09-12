const express = require("express");
const Book = require("../models/book");
const { validate } = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");
const router = new express.Router();
//===============>>>>>>> questions on lines 34, 66

// Example of book object for the exercise
// {
//   "isbn": "0691161518",
//   "amazon_url": "http://a.co/eobPtX2",
//   "author": "Matthew Lane",
//   "language": "english",
//   "pages": 264,
//   "publisher": "Princeton University Press",
//   "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
//   "year": 2017
// }

/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:isbn", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.isbn);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
// Is this validating that all the information for bookSchema is present? Is it checking that all the required 
// sections (schemas/bookSchema.json line 7-13) are all present?
    const validation = validate(req.body, bookSchema);
    if(!validation.valid) {
      return next({
          status: 400,
          error: validation.errors.map(e => e.stack)
      });
    }
    const book = await Book.create(req.body);
    return res.status(201).json({book});
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
// I am not entirely sure what this update function is doing, if we are passing in the isbn does that mean we can change the other
// properties of the book object?
    if ("isbn" in req.body) {
      return next({
        status: 400,
        message: "Not allowed"
      });
    }
    const validation = validate(req.body, bookSchemaUpdate);
    if (!validation.valid) {
      return next({
        status: 400,
        errors: validation.errors.map(e => e.stack)
      });
    }
    const book = await Book.update(req.params.isbn, req.body);
    return res.json({book});
  }

  catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
