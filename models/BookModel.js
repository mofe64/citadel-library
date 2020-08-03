const mongoose = require('mongoose');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book Title requires'],
    },
    slug: String,
    author: {
      type: String,
      required: [true, 'Author name is required'],
    },
    pageCount: Number,
    coverImage: {
      type: String,
      required: [true, 'Please provide a cover image'],
    },
    images: [String],
    downloadCount: Number,
    downloadLink: String,
    featured: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.pre('save', function (next) {
  this.slug = slugify(`${this.title}`, { lower: true });
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
