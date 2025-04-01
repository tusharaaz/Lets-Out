module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // Store the URL they were trying to access
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        // Clear it from the session
        delete req.session.redirectUrl;
    }
    next();
};