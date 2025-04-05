const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema");
const { reviewSchema } = require("./schema");
const Review = require("./models/review");

// Authentication middleware
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

// Save redirect URL middleware
// module.exports.saveRedirectUrl = (req, res, next) => {
//     if (req.session.redirectUrl) {
//         res.locals.redirectUrl = req.session.redirectUrl;
//         delete req.session.redirectUrl;
//     }
//     next();
// };

/**
 * Middleware to handle redirect URLs for authentication flow
 * Saves the redirect URL from session to res.locals and cleans up the session
 */
module.exports.saveRedirectUrl = (req, res, next) => {
    try {
        // Check if we have a redirect URL in session
        if (req.session.redirectUrl) {
            // Exclude login and signup pages from redirect
            const redirectUrl = req.session.redirectUrl;
            if (!redirectUrl.includes('/login') && !redirectUrl.includes('/signup')) {
                res.locals.redirectUrl = redirectUrl;
            }
            
            // Clean up session
            delete req.session.redirectUrl;
        }
        next();
    } catch (err) {
        // Log error and continue without redirect
        console.error("Error in saveRedirectUrl middleware:", err);
        next();
    }
};

// Owner verification middleware
module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You don't have permission to do that!");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

// Listing validation middleware
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(errorMsg, 400);
    }
    next();
};

// Export validateReview middleware
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errorMsg, 400);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        
        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }
        
        if (!review.author.equals(req.user._id)) {
            req.flash("error", "You don't have permission to do that!");
            return res.redirect(`/listings/${id}`);
        }
        
        next();
    } catch (err) {
        next(err);
    }
};