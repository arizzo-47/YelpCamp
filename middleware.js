module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
        console.log(req.session);
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}