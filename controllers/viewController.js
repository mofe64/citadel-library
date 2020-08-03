const Book = require('../models/BookModel');
const BookRequest = require('../models/requestModel');
const catchAsync = require('../utils/catchAsync');

exports.getHome = catchAsync(async (req, res, next) => {
  const featuredBooks = await Book.find({ featured: true })
    .limit(4)
    .sort('-createdAt');
  //console.log(req.user);
  const recentlyAdded = await Book.find().limit(20);
  res.status(200).render('index', {
    featuredBooks,
    recentlyAdded,
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findOne({ slug: req.params.slug });
  res.status(200).render('bookPage', {
    book,
  });
});

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find().sort('-createdAt');
  res.status(200).render('allBooks', {
    books,
  });
});

exports.getAbout = catchAsync(async (req, res, next) => {
  res.status(200).render('about');
});

exports.getrequests = catchAsync(async (req, res, next) => {
  res.status(200).render('requests', {
    user: req.user,
  });
});

exports.makeRequest = catchAsync(async (req, res, next) => {
  const newReq = await BookRequest.create({
    bookName: req.body.title,
    bookAuthor: req.body.author,
    description: req.body.description,
    publishDate: req.body.publishDate,
    userId: req.body.userId,
  });
  req.flash('success_msg', 'Request made successfully');
  res.redirect('/');
});

exports.getRegister = catchAsync(async (req, res, next) => {
  res.status(200).render('register');
});

exports.getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render('login');
});

//admin controllers
exports.getAdminHome = catchAsync(async (req, res, next) => {
  const books = await Book.find().limit(50);
  const requests = await BookRequest.find({ status: false }).populate({
    path: 'userId',
    select: '-password -firstname -lastname -email ',
  });
  //console.log(requests);
  res.status(200).render('admin/adminHome', {
    books,
    requests,
  });
});

//book upload page
exports.getBookUploadPage = catchAsync(async (req, res, next) => {
  res.status(200).render('admin/uploadBook');
});

exports.uploadBook = catchAsync(async (req, res, next) => {
  let featuredCheck;
  if (req.body.featured) {
    featuredCheck = true;
  } else {
    featuredCheck = false;
  }
  const downloadLink = req.body.downloadLink;
  const splitDownloadLink = downloadLink.split('upload');
  const str1 = splitDownloadLink[0];
  const str2 = splitDownloadLink[1];
  const str3 = 'upload/fl_attachment';
  const modifiedDownloadLink = str1.concat(str3, str2);
  const newBook = await Book.create({
    title: req.body.title,
    author: req.body.author,
    pageCount: req.body.pageCount,
    coverImage: req.body.coverImage,
    featured: featuredCheck,
    downloadLink: modifiedDownloadLink,
    description: req.body.description,
  });
  res.status(201).redirect('/admin/dashboard');
});

exports.uploadBooksToCloudinary = catchAsync(async (req, res, next) => {
  res.status(200).render('admin/cloudinaryUploadPage');
});

exports.getRequestsPageAdmin = catchAsync(async (req, res, next) => {
  const request = await BookRequest.findById(req.params.requestId);
  res.status(200).render('admin/requests', {
    request,
  });
});

exports.fulfillRequest = catchAsync(async (req, res, next) => {
  if (req.body.fulfilled) {
    const request = await BookRequest.findByIdAndUpdate(req.params.requestId, {
      status: true,
    });
    return res.status(200).redirect(`/admin/request/${request._id}`);
  }
  res.status(200).redirect(`/admin/request/${req.params.requestId}`);
});
