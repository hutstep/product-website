var mongoose = require('mongoose');
var Book = mongoose.model('Book');

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.booksReadAll = function (req, res) {
  Book.find().select('nameLong nameShort affLinks affBanner').exec(
    function (err, books) {
      if (!books) {
        sendJsonResponse(res, 404, {
          message: 'No books found'
        });
      } else if (err) {
        sendJsonResponse(res, 404, err);
      } else {
        sendJsonResponse(res, 200, books);
      }
    }
  );
};

module.exports.booksReadOne = function (req, res) {
  if (req.params && req.params.bookname) {
    Book.findOne({
      nameShort: req.params.bookname
    }).exec(
      function (err, book) {
        if (!book) {
          sendJsonResponse(res, 404, {
            message: 'bookname not found'
          });
        } else if (err) {
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res, 200, book);
        }
      }
    );
  } else {
    sendJsonResponse(res, 404, {
      message: 'No bookname in request'
    });
  }
};