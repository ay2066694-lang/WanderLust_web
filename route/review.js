const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/review.js");



//Reviews route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));


//Delete Review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));


module.exports = router;