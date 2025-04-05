const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

router.post("/", 
    isLoggedIn,
    validateReview,
    wrapAsync(reviews.createReview)
);

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviews.deleteReview)
);

module.exports = router;