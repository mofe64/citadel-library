const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn); //check user logged in status
router.route('/').get(viewController.getHome); //home
router.route('/about').get(viewController.getAbout);
router.route('/books').get(viewController.getAllBooks);
router
  .route('/register')
  .get(viewController.getRegister)
  .post(authController.register);
router.route('/login').get(viewController.getLogin).post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/books/:slug').get(viewController.getBook);
router
  .route('/ticket/:bookId')
  .get(viewController.getTicketPage)
  .post(viewController.submitTicket);

router
  .route('/request')
  .get(authController.ensureAuthenticated, viewController.getrequests)
  .post(authController.ensureAuthenticated, viewController.makeRequest);

//admin
router.route('/admin/dashboard').get(viewController.getAdminHome);

router
  .route('/admin/book')
  .get(viewController.getBookUploadPage)
  .post(viewController.uploadBook);

//edit book
router
  .route('/admin/editBook/:slug')
  .get(viewController.editBookPage)
  .patch(viewController.editBook)
  .delete(viewController.deleteBook);

//cloudinary upload
router.route('/admin/cloudinary').get(viewController.uploadBooksToCloudinary);

//requests
router
  .route('/admin/request/:requestId')
  .get(viewController.getRequestsPageAdmin)
  .post(viewController.fulfillRequest);
module.exports = router;

//tickets
router
  .route('/admin/tickets/:ticketId')
  .get(viewController.getFixTicket)
  .patch(viewController.updateTicket);
