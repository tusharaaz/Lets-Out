const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listings = require("../controllers/listings");
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

// Group routes by base path using router.route()
router.route("/")
    .get(wrapAsync(listings.index))

    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listings.createListing)
    );
    

// New listing form route
router.route("/new")
    .get(isLoggedIn, listings.renderNewForm);

// Group routes with :id parameter
router.route("/:id")
    .get(wrapAsync(listings.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listings.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listings.deleteListing)
    );

// Edit form route
router.route("/:id/edit")
    .get(
        isLoggedIn,
        isOwner,
        wrapAsync(listings.renderEditForm)
    );

module.exports = router;