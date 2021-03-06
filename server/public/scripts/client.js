$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.bookToDelete', handleBookDelete);
  $('#bookShelf').on('click', '.isReadButton', readHandle);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td><button class="isReadButton" data-id=${book.id}>Read It</button></td>
        <td><button class="bookToDelete" data-id=${book.id}>Delete</button></td>
      </tr>
    `);
  }
}

function deleteBook(bookId) {
  $.ajax({
      method: 'DELETE',
      url: `/books/${bookId}`
  }).then(response => {
      console.log('GOODBYE, KNOWLEDGE! 👋');
      refreshBooks();
  }).catch(err => {
      alert('There was a problem getting rid of that book. Maybe reconsider? 🥺', err);
      console.log(err);
  });
}

function handleBookDelete() {
  deleteBook($(this).data("id"));
} // end handleReadBook fn

function readHandle() {
  // pass the songId and the vote direction
  handleIsRead($(this).data("id"), "TRUE");
}

// Record the vote
/**
* Change the rank on a song, using the song's id and a voting direction. Up votes increase the song rank. Down votes
* decrease the song rank.
* @param {number} bookId
* @param {string} haveRead
*/
function handleIsRead(bookId, haveRead) {
  $.ajax({
      method: 'PUT',
      url: `/books/${bookId}`,
      data: {
          isRead: haveRead //req.body.direction, will evaluate to either true or false
      }
  })
  .then(response => {
      console.log('I READ THIS ALREADY');
      refreshBooks();
  })
  .catch(err => {
      console.log(`Wait, idk if I've read this actually...`, err);
      alert('There was a problem marking this as read. Are you sure you read it? 🧐');
  });
}

// Could not update book read status due to error: invalid input syntax for type integer: "[object Object]"
// PUT http://localhost:5000/books/[object%20Object] 500 (Internal Server Error)
// handleIsRead @client.js:101