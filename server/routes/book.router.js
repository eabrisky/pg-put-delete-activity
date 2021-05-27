const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status


// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id

router.delete('/:id', (req, res) => {
  const itemToDelete = req.params.id;
  const queryString = `DELETE FROM "books" WHERE "books".id = $1;`;
  pool.query(queryString, [itemToDelete])
      .then(response => {
          console.log(`Deleted a book with id ${itemToDelete}.`);
          res.sendStatus(200);
      })
      .catch(err => {
          console.log('ERROR DELETING BOOOOOOK', err);
          res.sendStatus(500);
      });
});

// url localhost:5000/books/id
router.put('/:id', (req, res) => {
  const bookId = req.params.id;

  let haveRead = req.body.isRead;

  let queryString = '';

  if (haveRead === 'TRUE'){
      queryString = 'UPDATE "books" SET "isRead"=TRUE WHERE "books".id= $1;'; // $1 comes from url, it is req.params.id
  }

  pool.query(queryString, [bookId]) // here $1 becomes bookID array, which is req.params.id
      .then(response => {
          console.log(response.rowCount);
          res.sendStatus(202);
      })
      .catch(err => {
          console.log('Could not update book read status due to', err);
          res.sendStatus(500);
      });
})


module.exports = router;
