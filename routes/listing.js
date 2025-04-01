const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema} = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errorMsg, 400);
    }
    next();
};

//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", isLoggedIn,(req, res) => {
    console.log(req.user);
   
    res.render("listings/new.ejs");
});

//Create Route
router.post("/", validateListing,isLoggedIn, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();

    req.flash("success", "Successfully created a new listing!");
    
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    req.flash("success", "Successfully edited a listing!");
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
router.put("/:id", validateListing,isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { 
        ...req.body.listing,
        image: {
            url: req.body.listing.image.url,
            filename: "listingimage"
        }
    });

    req.flash("success", "Successfully updated a listing!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    if (!deletedListing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    req.flash("success", "Successfully deleted a new listing!");
    res.redirect("/listings");
}));

  //show route
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }));

module.exports = router;