var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {
    type: Number,
    'default': 0,
    min: 0,
    max: 5
  },
  date: String,
  reviewText: String
});

var bookSchema = new mongoose.Schema({
  nameLong: String,
  nameShort: String,
  author: String,
  description: String,
  video: String,
  affLinks: {
    us: String,
    others: String
  },
  affBanner: {
    us: {
      img: String,
      alt: String,
      link: String
    },
    others: {
      img: String,
      alt: String,
      link: String
    }
  },
  reviews: [reviewSchema]
});

mongoose.model('Book', bookSchema);